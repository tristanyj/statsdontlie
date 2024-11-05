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

export type ColumnKey =
  | 'regular-season.general.games'
  | 'regular-season.passing.completions'
  | 'regular-season.passing.attempts'
  | 'regular-season.passing.completion-percentage'
  | 'regular-season.passing.yards'
  | 'regular-season.passing.touchdowns'
  | 'regular-season.passing.interceptions'
  | 'regular-season.passing.rating'
  | 'regular-season.passing.sacks'
  | 'regular-season.rushing.attempts'
  | 'regular-season.rushing.yards'
  | 'regular-season.rushing.touchdowns'
  | 'regular-season.rushing.first-downs'
  | 'regular-season.rushing.fumbles'
  | 'post-season.general.games'
  | 'post-season.passing.completions'
  | 'post-season.passing.attempts'
  | 'post-season.passing.completion-percentage'
  | 'post-season.passing.yards'
  | 'post-season.passing.touchdowns'
  | 'post-season.passing.interceptions'
  | 'post-season.passing.rating'
  | 'post-season.passing.sacks'
  | 'post-season.rushing.attempts'
  | 'post-season.rushing.yards'
  | 'post-season.rushing.touchdowns'
  | 'post-season.rushing.first-downs'
  | 'post-season.rushing.fumbles'
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
  stats: Record<ColumnKey, number>;
}

// const getEnrichedColumn = (column: Column) => ({
//   ...column,
//   meta: {
//     ...column.meta,
//     scale: getScale(column),
//     format: getFormat(column),
//   },
// });

export interface EnrichedColumn extends Column {
  meta: Column['meta'] & {
    scale: (value: number) => number;
    format: (value: number) => string;
  };
}

export interface Column {
  id: ColumnKey;
  name: string;
  meta: {
    domainMin: number;
    domainMax: number;
    scaleType: 'linear' | 'log' | 'pow';
    formatType: 'number' | 'percent' | 'time';
    labels: [
      { value: number; position: 0.0 },
      { value: number; position: 0.25 },
      { value: number; position: 0.5 },
      { value: number; position: 0.75 },
      { value: number; position: 1.0 }
    ];
  };
  record: {
    value: number;
    playerId: string;
  };
}

export interface EnrichedGroup extends Group {
  subGroups: EnrichedSubGroup[];
}

export interface Group {
  id: GroupKey;
  name: string;
  subGroups: SubGroup[];
}

export interface EnrichedSubGroup extends SubGroup {
  columns: EnrichedColumn[];
}

export interface SubGroup {
  id: SubGroupKey;
  name: string;
  columns: Column[];
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

export interface ArcDataExtended {
  columnId: string;
  columnIndex: number;
  player: Player;
  stat: number;
  scaledValue: number;
}
