//////////////////////////
// Dataset Definition
//////////////////////////

export type GroupKey = 'regular-season' | 'post-season' | 'awards';

export type SubGroupKey =
  | 'regular-season.general'
  | 'regular-season.passing'
  | 'regular-season.rushing'
  | 'post-season.general'
  | 'post-season.passing'
  | 'post-season.rushing'
  | 'awards.individual'
  | 'awards.team';

export type StatKey =
  | 'regular-season.general.games'
  | 'regular-season.passing.completions'
  | 'regular-season.passing.attempts'
  | 'regular-season.passing.completion-percentage'
  | 'regular-season.passing.yards'
  | 'regular-season.passing.touchdowns'
  | 'regular-season.passing.interceptions'
  | 'regular-season.passing.rating'
  | 'regular-season.passing.sacks'
  | 'regular-season.passing.fumbles'
  | 'regular-season.rushing.attempts'
  | 'regular-season.rushing.yards'
  | 'regular-season.rushing.touchdowns'
  | 'post-season.general.games'
  | 'post-season.passing.completions'
  | 'post-season.passing.attempts'
  | 'post-season.passing.completion-percentage'
  | 'post-season.passing.yards'
  | 'post-season.passing.touchdowns'
  | 'post-season.passing.interceptions'
  | 'post-season.passing.rating'
  | 'post-season.passing.sacks'
  | 'post-season.passing.fumbles'
  | 'post-season.rushing.attempts'
  | 'post-season.rushing.yards'
  | 'post-season.rushing.touchdowns'
  | 'awards.individual.mvp'
  | 'awards.individual.sb-mvp'
  | 'awards.individual.pro-bowl'
  | 'awards.individual.all-pro-first'
  | 'awards.individual.all-pro-second'
  | 'awards.team.sb-appearance'
  | 'awards.team.sb-win';

export type PlayerKey = 'aaron-rodgers' | 'tom-brady';

export interface Player {
  id: PlayerKey;
  name: string;
  position: string;
  teams: string[];
  years: [number, number | null];
  numbers: number[];
  height: string;
  weight: number;
  handedness: 'left' | 'right';
  // colors are in hex format
  colors: `#${string}`[];
  stats: Record<StatKey, number>;
}

// const getEnrichedStat = (column: Stat) => ({
//   ...column,
//   meta: {
//     ...column.meta,
//     scale: getScale(column),
//     format: getFormat(column),
//   },
// });

export interface EnrichedStat extends Stat {
  color: `#${string}`;
  meta: Stat['meta'] & {
    scale: (value: number) => number;
    format: (value: number) => string;
  };
}

export interface Stat {
  id: StatKey;
  name: string;
  meta: {
    domain?: number[];
    range?: number[];
    domainMin: number;
    domainMax: number;
    scaleType: 'linear' | 'log' | 'pow' | 'threshold' | 'quantile';
    formatType: 'number' | 'percent' | 'time';
  };
  record: {
    qb: {
      value: number;
      name: string;
    };
    all: {
      value: number;
      name: string;
      position: string;
    };
  };
}

export interface EnrichedGroup extends Group {
  subGroups: EnrichedSubGroup[];
}

export interface Group {
  id: GroupKey;
  name: string;
  color: `#${string}`;
  subGroups: SubGroup[];
}

export interface EnrichedSubGroup extends SubGroup {
  stats: EnrichedStat[];
}

export interface SubGroup {
  id: SubGroupKey;
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
  color: `${string}`;
  value: number;
}

export interface LineData {
  className: string;
  y1: number;
  y2: number;
  stroke?: string;
  opacity?: number;
  transform: string;
}
