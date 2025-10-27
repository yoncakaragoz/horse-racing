import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackComponent } from './track.component';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
  
(global as any).ResizeObserver = ResizeObserver;
  
describe('TrackComponent', () => {
  let fixture: ComponentFixture<TrackComponent>;
  let component: TrackComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackComponent);
    component = fixture.componentInstance;

    component.round = { id: 1, distance: 1200, participants: [1,2,3], results: [] } as any;
    component.horses = [
      { id: 1, name: 'H1', color: '#f00', condition: 50 },
      { id: 2, name: 'H2', color: '#0f0', condition: 60 },
      { id: 3, name: 'H3', color: '#00f', condition: 70 },
    ];
    component.positions = { 1: 0, 2: 0, 3: 0 };
    fixture.detectChanges();
  });

  it('renders a lane per participant', () => {
    const lanes = fixture.nativeElement.querySelectorAll('app-lane');
    expect(lanes.length).toBe(3);
  });
});
