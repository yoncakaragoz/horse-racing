import { jest } from '@jest/globals';

jest.mock('../constants', () => ({
  DISTANCES: [800, 1200, 1600],
  PALETTE: ['#A', '#B'],
  LANE_COUNT_PER_ROUND: 3,
}));

const pickDistinctMock = jest.fn<(arr: number[], count: number) => number[]>();
const randIntMock = jest.fn<(min: number, max: number) => number>();

jest.mock('../utils', () => ({
  pickDistinct: (...args: [number[], number]) => pickDistinctMock(...args),
  randInt: (...args: [number, number]) => randIntMock(...args),
}));

import { ScheduleService } from './schedule.service';
import { DISTANCES, PALETTE, LANE_COUNT_PER_ROUND } from '../constants';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ScheduleService();
  });

  describe('generateHorses', () => {
    it('generates the exact total within bounds with correct ids, names, colors', () => {
      randIntMock.mockReturnValue(33);
      const horses = service.generateHorses(5); 
      expect(horses.map(h => h.id)).toEqual([1, 2, 3, 4, 5]);
      expect(horses.map(h => h.name)).toEqual(['Horse 1', 'Horse 2', 'Horse 3', 'Horse 4', 'Horse 5']);
      expect(horses.map(h => h.color)).toEqual(['#A', '#B', '#A', '#B', '#A']); // wrap around
      expect(horses.every(h => h.condition === 33)).toBe(true);
    });
  });

  describe('generateRounds', () => {
    it('creates one round per DISTANCES item with correct id and distance', () => {
      randIntMock.mockReturnValue(50);
      const horses = service.generateHorses(4); // ids: 1..4
      pickDistinctMock
        .mockReturnValueOnce([1, 2, 3])
        .mockReturnValueOnce([2, 3, 4])
        .mockReturnValueOnce([1, 4, 2]);

      const rounds = service.generateRounds(horses);
      expect(rounds.length).toBe(DISTANCES.length);

      rounds.forEach((r, idx) => {
        expect(r.id).toBe(idx + 1);
        expect(r.distance).toBe(DISTANCES[idx]);
      });

      expect(rounds[0].participants).toEqual([1, 2, 3]);
      expect(rounds[1].participants).toEqual([2, 3, 4]);
      expect(rounds[2].participants).toEqual([1, 4, 2]);
      rounds.forEach(r => expect(r.results).toEqual([]));
    });
  });
});
