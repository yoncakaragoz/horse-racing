import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LaneComponent {
  @Input() laneNumber!: number;
  @Input() name!: string;
  @Input() color!: string;
  @Input() condition!: number;
  @Input() xPx = 0;

  get aria() { 
    return `Lane ${this.laneNumber}, ${this.name}, condition ${this.condition}`; 
  }
}