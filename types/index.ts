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
    height: string;
    weight: string;
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
  description: string | null;
  abbreviation: string;
  color: `#${string}`;
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

export interface EnrichedCategory extends Category {
  subCategories: EnrichedSubCategory[];
}

export interface EnrichedSubCategory extends SubCategory {
  stats: EnrichedStat[];
}

export interface EnrichedStat extends Stat {
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
  statValue: string;
  player: Player;
  startAngle: number;
  endAngle: number;
  category: Category;
  subCategory: SubCategory;
}

export interface StatLabelArcData {
  id: string;
  index: number;
  stat: EnrichedStat;
  startAngle: number;
  endAngle: number;
  category: Category;
  subCategory: SubCategory;
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

export interface TooltipStat {
  id: string;
  playerId: PlayerKey;
  playerName: string;
  playerColor: `#${string}`;
  categoryName: string;
  categoryColor: `#${string}`;
  subCategoryName: string;
  statName: string;
  statDescription: string | null;
  statAbbreviation: string;
  value: string;
  record: {
    value: string;
    holder: string;
  };
}

export interface ToolTipStatLabel {
  id: string;
  categoryName: string;
  categoryColor: `#${string}`;
  subCategoryName: string;
  statName: string;
  statDescription: string | null;
  statAbbreviation: string;
  record: {
    value: string;
    holder: string;
  };
}

// --------------------------------
// UI
// --------------------------------

export type SortOption = {
  label: string;
  key: string;
};
