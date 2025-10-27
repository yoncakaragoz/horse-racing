import { Injectable } from '@angular/core';
import { Horse, Round } from '../models';
import { DISTANCES, PALETTE, LANE_COUNT_PER_ROUND } from '../constants';
import { pickDistinct, randInt } from '../utils';

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  generateHorses(total: number): Horse[] {
    const count = Math.max(1, Math.min(total, 20));
    const horses: Horse[] = Array.from({ length: count }, (_, i) => {
      const id = i + 1;
      const name = 'Horse ' + id;
      const color = PALETTE[i % PALETTE.length];
      const condition = randInt(1, 100);
      return { id, name, color, condition };
    });
    
    return horses;
  }

  generateRounds(horses: Horse[]): Round[] {
    if (!horses || horses.length === 0) {
      return [];
    }
  
    const horseIds = horses.map(h => h.id);
    return DISTANCES.map((distance, index) => ({
      id: index + 1,
      distance,
      participants: pickDistinct(horseIds, LANE_COUNT_PER_ROUND),
      results: [] 
    }));
  }
  
}