import { TestBed } from '@angular/core/testing';
import { GameStore } from './game.store';
import { ScheduleService } from './services/schedule.service';
import { SimEngineService } from './services/sim-engine.service';

describe('GameStore (Jest)', () => {
  let store: GameStore;
  let scheduleSvc: jest.Mocked<ScheduleService>;
  let simSvc: jest.Mocked<SimEngineService>;

  beforeEach(() => {
    jest.useFakeTimers();

    scheduleSvc = {
      generateHorses: jest.fn(),
      generateRounds: jest.fn(),
    } as any;

    simSvc = {
      cancel: jest.fn(),
      setPaused: jest.fn(),
      runRound: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        GameStore,
        { provide: ScheduleService, useValue: scheduleSvc },
        { provide: SimEngineService, useValue: simSvc },
      ],
    });

    store = TestBed.inject(GameStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(store).toBeTruthy();
    expect(store.horses()).toEqual([]);
    expect(store.rounds()).toEqual([]);
    expect(store.activeRoundIndex()).toBe(-1);
    expect(store.running()).toBe(false);
    expect(store.paused()).toBe(false);
    expect(store.positions()).toEqual({});
    expect(store.pxPerMeter()).toBeCloseTo(0.3);
  });

  it('generateGame sets horses and rounds', () => {
    const horses = [{ id: 1, name: 'Horse 1', color: '#111', condition: 50 }];
    const rounds = [{ id: 1, distance: 1000, participants: [1], results: [] }];

    scheduleSvc.generateHorses.mockReturnValue(horses as any);
    scheduleSvc.generateRounds.mockReturnValue(rounds as any);

    store.generateGame(1);

    expect(scheduleSvc.generateHorses).toHaveBeenCalledWith(1);
    expect(scheduleSvc.generateRounds).toHaveBeenCalledWith(horses);
    expect(store.horses()).toEqual(horses);
    expect(store.rounds()).toEqual(rounds);
  });
});
