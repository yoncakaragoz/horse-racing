import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlPanelComponent } from './control-panel.component';

describe('ControlPanelComponent (standalone)', () => {
  let fixture: ComponentFixture<ControlPanelComponent>;
  let component: ControlPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPanelComponent],
    })
      .overrideComponent(ControlPanelComponent, {
        set: {
          template: `
            <div>
              <button class="generate"    (click)="generate.emit()">Generate</button>
              <button class="start"  [disabled]="!canStart || running" (click)="start.emit()">Start</button>
              <button class="pause"  [disabled]="!running || paused"  (click)="pause.emit()">Pause</button>
              <button class="resume" [disabled]="!running || !paused" (click)="resume.emit()">Resume</button>
              <button class="reset"  (click)="reset.emit()">Reset</button>
            </div>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.running).toBe(false);
    expect(component.paused).toBe(false);
    expect(component.canStart).toBe(false);
  });

  it('emits outputs on button clicks', () => {
    const generateSpy    = jest.spyOn(component.generate, 'emit');
    const startSpy  = jest.spyOn(component.start, 'emit');
    const pauseSpy  = jest.spyOn(component.pause, 'emit');
    const resumeSpy = jest.spyOn(component.resume, 'emit');
    const resetSpy  = jest.spyOn(component.reset, 'emit');

    component.canStart = true;
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.generate')   as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.start') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.reset') as HTMLButtonElement).click();

    expect(generateSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(pauseSpy).not.toHaveBeenCalled();
    expect(resumeSpy).not.toHaveBeenCalled();
  });

});
