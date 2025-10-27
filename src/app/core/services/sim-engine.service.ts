import { Injectable } from '@angular/core';
import { Horse, RoundResult } from '../models';

type PosMap = Record<number, number>;

@Injectable({ providedIn: 'root' })
export class SimEngineService {
  private readonly BASE_SPEED = 0.18;       // base pixel per millisecond speed
  private readonly COND_FACTOR = 0.12;      // condition influence factor
  private readonly RAND_OFFSET = 0.02;      // random ± offset for variety
  private readonly MAX_DT_MS = 32;          // cap for frame delta time
  private readonly EMIT_EVERY_MS = 24;      // update rate (~40fps)

  private paused = false;
  private rafId = 0;

  setPaused(v: boolean) { this.paused = v; }
  isPaused() { return this.paused; }

  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  /**
   * simple race engine
   * each horse has a constant speed determined at the start
   * positions are updated on each animation frame
   * handles pause/resume, cancel, and result ranking
   */
  runRound(
    participants: number[],
    _distanceM: number,
    horses: Horse[],
    trackPx: number,
    onPositions: (pos: PosMap) => void,
    shouldCancel: () => boolean = () => false
  ): Promise<RoundResult[]> {

    const horseById = new Map(horses.map(h => [h.id, h]));
    const positions = this.initPositions(participants);
    const speeds = this.buildSpeedTable(participants, horseById);

    const finished: { horseId: number; timeMs: number }[] = [];
    const finishedSet = new Set<number>();

    const start = performance.now();
    let lastTs = start;
    let lastEmitTs = start;

    const schedule = (cb: FrameRequestCallback) => {
      this.rafId = requestAnimationFrame(cb);
    };

    return new Promise<RoundResult[]>((resolve) => {
      const step: FrameRequestCallback = (ts) => {
        // handle cancellation
        if (shouldCancel()) {
          this.cancel();
          resolve([]);
          return;
        }

        // handle pause
        if (this.paused) {
          lastTs = ts;
          return schedule(step);
        }

        // calculate frame delta time 
        const dt = Math.min(this.MAX_DT_MS, ts - lastTs);
        lastTs = ts;

        // update each horse
        for (const id of participants) {
          if (finishedSet.has(id)) continue;

          positions[id] += speeds[id] * dt;

          // if horse reaches the finish line
          if (positions[id] >= trackPx) {
            positions[id] = trackPx;
            finished.push({ horseId: id, timeMs: ts - start });
            finishedSet.add(id);
          }
        }

        // emit updated positions at limited frequency
        if (ts - lastEmitTs >= this.EMIT_EVERY_MS) {
          onPositions({ ...positions });
          lastEmitTs = ts;
        }

        // check if all horses finished
        if (finished.length === participants.length) {
          this.cancel();
          finished.sort((a, b) => a.timeMs - b.timeMs);
          const results: RoundResult[] = finished.map((f, i) => ({
            horseId: f.horseId,
            timeMs: f.timeMs,
            rank: i + 1
          }));
          resolve(results);
          return;
        }
        schedule(step);
      };
      schedule(step);
    });
  }


  private initPositions(ids: number[]): PosMap {
    const pos: PosMap = {};
    for (const id of ids) pos[id] = 0;
    return pos;
  }

  /**
   * generate constant speeds for each horse
   */
  private buildSpeedTable(
    ids: number[],
    horseById: Map<number, Horse>
  ): Record<number, number> {
    const table: Record<number, number> = {};
    for (const id of ids) {
      const h = horseById.get(id);
      if (!h) { table[id] = this.BASE_SPEED; continue; }

      const condBoost = (h.condition / 100) * this.COND_FACTOR;
      const randomOffset = (Math.random() * 2 * this.RAND_OFFSET) - this.RAND_OFFSET;
      table[id] = Math.max(0.06, this.BASE_SPEED + condBoost + randomOffset);
    }
    return table;
  }
}
