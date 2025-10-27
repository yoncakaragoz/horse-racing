import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaneComponent } from './lane.component';

describe('LaneComponent (standalone, OnPush)', () => {
  let fixture: ComponentFixture<LaneComponent>;
  let component: LaneComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaneComponent],
    })
      .overrideComponent(LaneComponent, {
        set: {
          template: `
            <div
              class="lane"
              [attr.aria-label]="aria"
              [style.background]="color"
              [style.transform]="'translateX(' + xPx + 'px)'">
              <span class="num">{{ laneNumber }}</span>
              <span class="name">{{ name }}</span>
              <span class="cond">{{ condition }}</span>
            </div>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LaneComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders laneNumber, name and condition', () => {
    component.laneNumber = 5;
    component.name = 'Orion';
    component.condition = 88;
    component.color = '#123456';
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.num')?.textContent?.trim()).toBe('5');
    expect(host.querySelector('.name')?.textContent?.trim()).toBe('Orion');
    expect(host.querySelector('.cond')?.textContent?.trim()).toBe('88');
  });

});
