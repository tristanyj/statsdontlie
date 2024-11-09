import type { StatKey, CategoryKey, SubCategoryKey, PlayerKey } from './dataset';

export * from './dataset';

//////////////////////////
// Dataset Definition
//////////////////////////

export type ScaleType = 'linear' | 'log';
export type FormatType = 'number' | 'percent';

export interface Player {
  id: PlayerKey;
  color: `#${string}`;
  info: {
    name: string;
    nickname: string;
    position: string;
    shooting_hand: string;
    height: number;
    weight: number;
    birth_date: string;
    draft: [number, number];
    experience: number;
    teams: string[];
  };
  stats: Record<StatKey, number>;
}

export interface Category {
  id: CategoryKey;
  name: string;
  color: `#${string}`;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: SubCategoryKey;
  name: string;
  color: `#${string}`;
  stats: Stat[];
}

export interface Stat {
  id: StatKey;
  name: string;
  meta: {
    domain: [number, number];
    scaleType: ScaleType;
    formatType: FormatType;
  };
  record: {
    value: number;
    name: string;
  };
}

export interface EnrichedGroup extends Category {
  subCategories: EnrichedSubGroup[];
}

export interface EnrichedSubGroup extends SubCategory {
  stats: EnrichedStat[];
}

export interface EnrichedStat extends Stat {
  color: `#${string}`;
  meta: Stat['meta'] & {
    scale: (value: number) => number;
    format: (value: number, decimals: number) => string;
  };
}

//////////////////////////
// D3 Types
//////////////////////////

export type d3GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export interface ArcData {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface StatArcData {
  id: string;
  index: number;
  value: number;
  stat: EnrichedStat;
  player: Player;
  startAngle: number;
  endAngle: number;
}

export interface LineData {
  className: string;
  y1: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  transform: string;
}

export interface TooltipData {
  id: string;
}
