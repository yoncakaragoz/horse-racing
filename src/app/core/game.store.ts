import { Injectable, signal, computed, inject } from '@angular/core';
import { Horse, Round, Positions } from './models';
import { TOTAL_HORSES_DEFAULT } from './constants';
import { ScheduleService } from './services/schedule.service';
import { SimEngineService } from './services/sim-engine.service';

@Injectable({ providedIn: 'root' })
export class GameStore {
  readonly horses = signal<Horse[]>([]);
  readonly rounds = signal<Round[]>([]);
  readonly activeRoundIndex = signal<number>(-1);
  readonly running = signal<boolean>(false);
  readonly paused = signal<boolean>(false);
  readonly positions = signal<Positions>({});
  readonly pxPerMeter = signal<number>(0.3);

  private readonly raceCycleId = signal<number>(0);

  readonly activeRound = computed(() => {
    const i = this.activeRoundIndex();
    return i >= 0 ? this.rounds()[i] : null;
  });

  private readonly schedule = inject(ScheduleService);
  private readonly sim = inject(SimEngineService);

  private nextRunCycle(): number {
    const next = this.raceCycleId() + 1;
    this.raceCycleId.set(next);
    this.sim.cancel();
    return next;
  }

  private isAborted(token: number): boolean {
    return this.raceCycleId() !== token || !this.running();
  }

  private setSimPaused(value: boolean) {
    this.paused.set(value);
    this.sim.setPaused(value);
  }

  private resetState() {
    this.horses.set([]);
    this.rounds.set([]);
    this.activeRoundIndex.set(-1);
    this.running.set(false);
    this.paused.set(false);
    this.positions.set({});
    this.setSimPaused(false);
  }

  private beginRun() {
    this.running.set(true);
    this.setSimPaused(false);
  }

  private endRun() {
    this.running.set(false);
    this.setSimPaused(false);
  }

  private updateRoundResults(roundIndex: number, results: Round['results']) {
    const next = [...this.rounds()];
    next[roundIndex] = { ...next[roundIndex], results };
    this.rounds.set(next);
  }

  private sleep(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
  }


  generateGame(total = TOTAL_HORSES_DEFAULT) {
    this.nextRunCycle();
    const horses = this.schedule.generateHorses(total);
    const rounds = this.schedule.generateRounds(horses);

    this.horses.set(horses);
    this.rounds.set(rounds);
    this.activeRoundIndex.set(rounds.length ? 0 : -1);
    this.positions.set({});
    this.setSimPaused(false);
    this.running.set(false);
  }

  async startRace() {
    const rounds = this.rounds();
    if (!rounds.length) return;

    const token = this.nextRunCycle();
    this.beginRun();

    const horses = this.horses();
    const pxPerMeter = this.pxPerMeter();

    for (const [i, r] of rounds.entries()) {
      if (this.isAborted(token)) break;

      this.activeRoundIndex.set(i);
      const trackPx = r.distance * pxPerMeter;

      const results = await this.sim.runRound(
        r.participants,
        r.distance,
        horses,
        trackPx,
        (pos) => this.positions.set(pos),
        () => this.isAborted(token)
      );

      if (this.isAborted(token)) break;

      if (results.length) this.updateRoundResults(i, results);
      await this.sleep(600);
    }

    if (!this.isAborted(token)) this.endRun();
  }

  pause() {
    if (!this.running()) return;
    this.setSimPaused(true);
  }

  resume() {
    if (!this.running()) return;
    this.setSimPaused(false);
  }

  reset() {
    this.nextRunCycle();
    this.resetState();
  }

  updatePxPerMeterFromTrackWidth(trackWidthPx: number) {
    const ar = this.activeRound();
    if (!ar) return;
    this.pxPerMeter.set(trackWidthPx / ar.distance);
  }
}