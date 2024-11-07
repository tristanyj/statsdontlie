//////////////////////////
// Dataset Definition
//////////////////////////

export type FormatType = 'number' | 'percent' | 'time';
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

export type PlayerKey = 'aaron-rodgers' | 'tom-brady' | 'patrick-mahomes';

export type StatRecord = {
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

export type StatValue = {
  value: number;
  rank: [number, number];
};

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
  stats: Record<StatKey, StatValue>;
}

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
  meta: {
    domain: number[];
    range?: number[];
    scaleType: 'linear' | 'log' | 'pow' | 'threshold' | 'quantile';
    formatType: FormatType;
  };
  record: StatRecord;
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
  value: number;
  stat: EnrichedStat;
  player: Player;
  startAngle: number;
  endAngle: number;
}

export interface HoveredStatArc {
  id: string;
  stat: {
    id: StatKey;
    name: string;
    color: `#${string}`;
    format: (value: number, decimals: number) => string;
    formatType: FormatType;
    record: StatRecord;
  };
  player: {
    id: PlayerKey;
    name: string;
    colors: `#${string}`[];
    stat: StatValue;
  };
}

export interface LineData {
  className: string;
  y1: number;
  y2: number;
  stroke?: string;
  opacity?: number;
  transform: string;
}
