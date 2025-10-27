export interface Horse {
    id: number; name: string; color: string; condition: number;
}

export interface RoundResult {
    horseId: number; timeMs: number; rank: number;
}

export interface Round {
    id: number; distance: number; participants: number[]; results: RoundResult[];
}

export interface Positions {
    [horseId: number]: number;
}