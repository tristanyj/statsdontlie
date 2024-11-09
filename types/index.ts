import type { StatKey, CategoryKey, SubCategoryKey, Player, StatMeta } from './dataset';

export * from './dataset';

//////////////////////////
// Dataset Definition
//////////////////////////

export type FormatType = 'number' | 'percent';

export type PlayerKey = 'aaron-rodgers' | 'tom-brady' | 'patrick-mahomes';

export interface EnrichedStat extends Stat {
  color: `#${string}`;
  meta: Stat['meta'] & {
    scale: (value: number) => number;
    format: (value: number, decimals: number) => string;
  };
}

export interface Stat {
  id: StatKey;
  name: string;
  meta: StatMeta;
  record: {
    value: number;
    name: string;
  };
}

export interface EnrichedGroup extends Group {
  subCategories: EnrichedSubGroup[];
}

export interface Group {
  id: CategoryKey;
  name: string;
  color: `#${string}`;
  subCategories: SubGroup[];
}

export interface EnrichedSubGroup extends SubGroup {
  stats: EnrichedStat[];
}

export interface SubGroup {
  id: SubCategoryKey;
  name: string;
  color: `#${string}`;
  stats: Stat[];
}

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
