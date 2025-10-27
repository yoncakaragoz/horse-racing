import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Round, Horse, Positions } from '../../core/models';
import { LaneComponent } from '../lane/lane.component';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, LaneComponent],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements AfterViewInit, OnDestroy {
  @Input() round!: Round;
  @Input() horses: Horse[] = [];
  @Input() positions: Positions = {};
  @Output() trackWidthChanged = new EventEmitter<number>();

  @ViewChild('track', { static: true }) trackEl!: ElementRef<HTMLDivElement>;
  private resizeObserver!: ResizeObserver;

  getName(id: number) { 
    return this.horses.find(h => h.id === id)?.name ?? `Horse ${id}`; 
  }
  getColor(id: number) { 
    return this.horses.find(h => h.id === id)?.color ?? '#111827'; 
  }
  getCondition(id: number) { 
    return this.horses.find(h => h.id === id)?.condition ?? 50; 
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      const w = this.trackEl.nativeElement.clientWidth - 60;
      this.trackWidthChanged.emit(w);
    });
    this.resizeObserver.observe(this.trackEl.nativeElement);
  }
  ngOnDestroy() { this.resizeObserver?.disconnect(); }
  trackById = (_: number, id: number) => id;
}