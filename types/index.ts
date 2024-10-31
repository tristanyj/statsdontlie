//////////////////////////
// Dataset Definition
//////////////////////////

export interface Player {
  id: string;
  name: string;
  position: string;
  teams: string[];
  years: [number, number | null];
  numbers: number[];
  height: string;
  weight: number;
  handedness: 'left' | 'right';
  stats: Record<string, number>;
}
