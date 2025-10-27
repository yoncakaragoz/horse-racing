import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppComponent } from './app.component';
import { GameStore } from './core/game.store';

describe('AppComponent (standalone)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  const mockStore: jest.Mocked<GameStore> = {
    horses: signal<any[]>([]),
    rounds: signal<any[]>([]),
    running: signal<boolean>(false),
    paused: signal<boolean>(false),
    activeRound: signal<any>(null) as any, // computed yerine basit signal yeterli
    positions: signal<Record<string, number>>({}),
    pxPerMeter: signal<number>(0.3),

    generateGame: jest.fn(),
    startRace: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    reset: jest.fn(),
    updatePxPerMeterFromTrackWidth: jest.fn(),

  } as unknown as jest.Mocked<GameStore>;

  beforeEach(async () => {
    mockStore.horses.set([]);
    mockStore.rounds.set([]);
    mockStore.running.set(false);
    mockStore.paused.set(false);
    (mockStore.activeRound as any).set?.(null);
    mockStore.positions.set({});
    mockStore.pxPerMeter.set(0.3);

    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: GameStore, useValue: mockStore }],
    })
      .overrideComponent(AppComponent, {
        set: {
          template: `
            <div class="title">{{ title }}</div>
            <div class="state">
              {{ running() ? 'running' : 'idle' }} /
              {{ paused() ? 'paused' : 'playing' }}
            </div>

            <button class="generate"    (click)="generateGame()">Generate</button>
            <button class="start"  (click)="startRace()">Start</button>
            <button class="pause"  (click)="pause()">Pause</button>
            <button class="resume" (click)="resume()">Resume</button>
            <button class="reset"  (click)="reset()">Reset</button>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show title', () => {
    expect(component).toBeTruthy();
    const titleEl = fixture.nativeElement.querySelector('.title') as HTMLElement;
    expect(titleEl.textContent?.trim()).toBe('Horse Racing');
  });

  it('calls store methods when buttons clicked', () => {
    (fixture.nativeElement.querySelector('.generate') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.start') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.pause') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.resume') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.reset') as HTMLButtonElement).click();

    expect(mockStore.generateGame).toHaveBeenCalledTimes(1);
    expect(mockStore.startRace).toHaveBeenCalledTimes(1);
    expect(mockStore.pause).toHaveBeenCalledTimes(1);
    expect(mockStore.resume).toHaveBeenCalledTimes(1);
    expect(mockStore.reset).toHaveBeenCalledTimes(1);
  });

});
