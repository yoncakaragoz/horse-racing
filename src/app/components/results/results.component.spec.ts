import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';

type TestHorse = { id: number; name: string; color: string };

describe('ResultsComponent', () => {
  let fixture: ComponentFixture<ResultsComponent>;
  let component: ResultsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent], 
    })

    .overrideComponent(ResultsComponent, {
    set: {
        template: `
        <ul>
            <li *ngFor="let h of horses" class="horse" [style.color]="getHorseColor(h.id)">
            {{ getHorseName(h.id) }}
            </li>
        </ul>
        `,
    },
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.rounds).toEqual([]);
    expect(component.horses).toEqual([]);
  });

  describe('getHorseName', () => {
    it('returns the exact name when horse exists', () => {
      const horses: TestHorse[] = [
        { id: 1, name: 'Test1', color: '#ff0000' },
        { id: 2, name: 'Test2', color: '#00ff00' },
      ];
      component.horses = horses as any;
      expect(component.getHorseName(1)).toBe('Test1');
      expect(component.getHorseName(2)).toBe('Test2');
    });

  });

  describe('getHorseColor', () => {
    it('returns the exact color when horse exists', () => {
      const horses: TestHorse[] = [
        { id: 1, name: 'Test1', color: '#ff0000' },
        { id: 2, name: 'Test2', color: '#00ff00' },
      ];
      component.horses = horses as any;
      expect(component.getHorseColor(1)).toBe('#ff0000');
      expect(component.getHorseColor(2)).toBe('#00ff00');
    });
  });
 
});
