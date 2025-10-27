import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Round, Horse } from '../../core/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() rounds: Round[] = [];
  @Input() horses: Horse[] = [];

  getHorseName(id: number) { 
    return this.horses?.find(h => h.id === id)?.name ?? `Horse ${id}`; 
  }

  getHorseColor(id: number) { 
    return this.horses?.find(h => h.id === id)?.color ?? '#111827'; 
  }
}