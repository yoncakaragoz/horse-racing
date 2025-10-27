import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { TrackComponent } from './components/track/track.component';
import { ResultsComponent } from './components/results/results.component';
import { GameStore } from './core/game.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ControlPanelComponent, TrackComponent, ResultsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private store = inject(GameStore);
  title = 'Horse Racing';

  horses = this.store.horses;
  rounds = this.store.rounds;
  running = this.store.running;
  paused = this.store.paused;
  activeRound = this.store.activeRound;
  positions = this.store.positions;

  generateGame = () => this.store.generateGame();
  startRace = () => this.store.startRace();
  pause = () => this.store.pause();
  resume = () => this.store.resume();
  reset = () => this.store.reset();
  onResizeTrackWidth = (w: number) => this.store.updatePxPerMeterFromTrackWidth(w);
}
