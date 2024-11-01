import * as d3 from 'd3';
import type { Column, Group } from '~/types';

export const useConfigStore = defineStore('config', () => {
  const statGroups = ref<Group[]>([
    {
      id: 'regular-season',
      name: 'Regular Season',
      subGroups: [
        {
          id: 'regular-season.general',
          name: 'General',
          columns: [
            {
              id: 'regular-season.general.games',
              name: 'Games Played',
              meta: {
                domainMin: 0,
                domainMax: 300,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 75, position: 0.25 },
                  { value: 150, position: 0.5 },
                  { value: 225, position: 0.75 },
                  { value: 300, position: 1.0 },
                ],
              },
              record: {
                value: 197,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
        {
          id: 'regular-season.passing',
          name: 'Passing',
          columns: [
            {
              id: 'regular-season.passing.completions',
              name: 'Completions',
              meta: {
                domainMin: 0,
                domainMax: 7000,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 1750, position: 0.25 },
                  { value: 3500, position: 0.5 },
                  { value: 5250, position: 0.75 },
                  { value: 7000, position: 1.0 },
                ],
              },
              record: {
                value: 6125,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.attempts',
              name: 'Attempts',
              meta: {
                domainMin: 0,
                domainMax: 11000,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 2750, position: 0.25 },
                  { value: 5500, position: 0.5 },
                  { value: 8250, position: 0.75 },
                  { value: 11000, position: 1.0 },
                ],
              },
              record: {
                value: 9380,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.completion-percentage',
              name: 'Completion %',
              meta: {
                domainMin: 55,
                domainMax: 75,
                scaleType: 'linear',
                formatType: 'percent',
                labels: [
                  { value: 55, position: 0.0 },
                  { value: 60, position: 0.25 },
                  { value: 65, position: 0.5 },
                  { value: 70, position: 0.75 },
                  { value: 75, position: 1.0 },
                ],
              },
              record: {
                value: 64.9,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.yards',
              name: 'Passing Yards',
              meta: {
                domainMin: 30000,
                domainMax: 90000,
                scaleType: 'log',
                formatType: 'number',
                labels: [
                  { value: 30000, position: 0.0 },
                  { value: 45000, position: 0.25 },
                  { value: 60000, position: 0.5 },
                  { value: 75000, position: 0.75 },
                  { value: 90000, position: 1.0 },
                ],
              },
              record: {
                value: 51255,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.touchdowns',
              name: 'Passing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 650,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 162, position: 0.25 },
                  { value: 325, position: 0.5 },
                  { value: 487, position: 0.75 },
                  { value: 650, position: 1.0 },
                ],
              },
              record: {
                value: 412,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.interceptions',
              name: 'Interceptions',
              meta: {
                domainMin: 0,
                domainMax: 300,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 75, position: 0.25 },
                  { value: 150, position: 0.5 },
                  { value: 225, position: 0.75 },
                  { value: 300, position: 1.0 },
                ],
              },
              record: {
                value: 251,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.rating',
              name: 'Passer Rating',
              meta: {
                domainMin: 70,
                domainMax: 130,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 70, position: 0.0 },
                  { value: 85, position: 0.25 },
                  { value: 100, position: 0.5 },
                  { value: 115, position: 0.75 },
                  { value: 130, position: 1.0 },
                ],
              },
              record: {
                value: 102.4,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.passing.sacks',
              name: 'Sacks Taken',
              meta: {
                domainMin: 0,
                domainMax: 500,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 125, position: 0.25 },
                  { value: 250, position: 0.5 },
                  { value: 375, position: 0.75 },
                  { value: 500, position: 1.0 },
                ],
              },
              record: {
                value: 303,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
        {
          id: 'regular-season.rushing',
          name: 'Rushing',
          columns: [
            {
              id: 'regular-season.rushing.attempts',
              name: 'Rushing Attempts',
              meta: {
                domainMin: 0,
                domainMax: 4000,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 1000, position: 0.25 },
                  { value: 2000, position: 0.5 },
                  { value: 3000, position: 0.75 },
                  { value: 4000, position: 1.0 },
                ],
              },
              record: {
                value: 667,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.rushing.yards',
              name: 'Rushing Yards',
              meta: {
                domainMin: 0,
                domainMax: 20000,
                scaleType: 'log',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 5000, position: 0.25 },
                  { value: 10000, position: 0.5 },
                  { value: 15000, position: 0.75 },
                  { value: 20000, position: 1.0 },
                ],
              },
              record: {
                value: 667,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.rushing.touchdowns',
              name: 'Rushing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 200,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 50, position: 0.25 },
                  { value: 100, position: 0.5 },
                  { value: 150, position: 0.75 },
                  { value: 200, position: 1.0 },
                ],
              },
              record: {
                value: 18,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.rushing.first-downs',
              name: 'Rushing First Downs',
              meta: {
                domainMin: 0,
                domainMax: 500,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 125, position: 0.25 },
                  { value: 250, position: 0.5 },
                  { value: 375, position: 0.75 },
                  { value: 500, position: 1.0 },
                ],
              },
              record: {
                value: 103,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'regular-season.rushing.fumbles',
              name: 'Rushing Fumbles',
              meta: {
                domainMin: 0,
                domainMax: 100,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 25, position: 0.25 },
                  { value: 50, position: 0.5 },
                  { value: 75, position: 0.75 },
                  { value: 100, position: 1.0 },
                ],
              },
              record: {
                value: 31,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'post-season',
      name: 'Post Season',
      subGroups: [
        {
          id: 'post-season.general',
          name: 'General',
          columns: [
            {
              id: 'post-season.general.games',
              name: 'Games Played',
              meta: {
                domainMin: 0,
                domainMax: 50,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 12.5, position: 0.25 },
                  { value: 25, position: 0.5 },
                  { value: 37.5, position: 0.75 },
                  { value: 50, position: 1.0 },
                ],
              },
              record: {
                value: 45,
                playerId: 'tom-brady',
              },
            },
          ],
        },
        {
          id: 'post-season.passing',
          name: 'Passing',
          columns: [
            {
              id: 'post-season.passing.completions',
              name: 'Completions',
              meta: {
                domainMin: 0,
                domainMax: 1200,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 300, position: 0.25 },
                  { value: 600, position: 0.5 },
                  { value: 900, position: 0.75 },
                  { value: 1200, position: 1.0 },
                ],
              },
              record: {
                value: 1130,
                playerId: 'tom-brady',
              },
            },
            {
              id: 'post-season.passing.attempts',
              name: 'Attempts',
              meta: {
                domainMin: 0,
                domainMax: 2000,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 500, position: 0.25 },
                  { value: 1000, position: 0.5 },
                  { value: 1500, position: 0.75 },
                  { value: 2000, position: 1.0 },
                ],
              },
              record: {
                value: 1757,
                playerId: 'tom-brady',
              },
            },
            {
              id: 'post-season.passing.completion-percentage',
              name: 'Completion %',
              meta: {
                domainMin: 55,
                domainMax: 75,
                scaleType: 'linear',
                formatType: 'percent',
                labels: [
                  { value: 55, position: 0.0 },
                  { value: 60, position: 0.25 },
                  { value: 65, position: 0.5 },
                  { value: 70, position: 0.75 },
                  { value: 75, position: 1.0 },
                ],
              },
              record: {
                value: 64.2,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.passing.yards',
              name: 'Passing Yards',
              meta: {
                domainMin: 0,
                domainMax: 15000,
                scaleType: 'log',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 3750, position: 0.25 },
                  { value: 7500, position: 0.5 },
                  { value: 11250, position: 0.75 },
                  { value: 15000, position: 1.0 },
                ],
              },
              record: {
                value: 4630,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.passing.touchdowns',
              name: 'Passing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 100,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 25, position: 0.25 },
                  { value: 50, position: 0.5 },
                  { value: 75, position: 0.75 },
                  { value: 100, position: 1.0 },
                ],
              },
              record: {
                value: 40,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.passing.interceptions',
              name: 'Interceptions',
              meta: {
                domainMin: 0,
                domainMax: 50,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 12.5, position: 0.25 },
                  { value: 25, position: 0.5 },
                  { value: 37.5, position: 0.75 },
                  { value: 50, position: 1.0 },
                ],
              },
              record: {
                value: 25,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.passing.rating',
              name: 'Passer Rating',
              meta: {
                domainMin: 70,
                domainMax: 130,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 70, position: 0.0 },
                  { value: 85, position: 0.25 },
                  { value: 100, position: 0.5 },
                  { value: 115, position: 0.75 },
                  { value: 130, position: 1.0 },
                ],
              },
              record: {
                value: 87.4,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.passing.sacks',
              name: 'Sacks Taken',
              meta: {
                domainMin: 0,
                domainMax: 100,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 25, position: 0.25 },
                  { value: 50, position: 0.5 },
                  { value: 75, position: 0.75 },
                  { value: 100, position: 1.0 },
                ],
              },
              record: {
                value: 22,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
        {
          id: 'post-season.rushing',
          name: 'Rushing',
          columns: [
            {
              id: 'post-season.rushing.attempts',
              name: 'Rushing Attempts',
              meta: {
                domainMin: 0,
                domainMax: 300,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 75, position: 0.25 },
                  { value: 150, position: 0.5 },
                  { value: 225, position: 0.75 },
                  { value: 300, position: 1.0 },
                ],
              },
              record: {
                value: 45,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.rushing.yards',
              name: 'Rushing Yards',
              meta: {
                domainMin: 0,
                domainMax: 1000,
                scaleType: 'log',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 250, position: 0.25 },
                  { value: 500, position: 0.5 },
                  { value: 750, position: 0.75 },
                  { value: 1000, position: 1.0 },
                ],
              },
              record: {
                value: 18,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.rushing.touchdowns',
              name: 'Rushing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 20,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 5, position: 0.25 },
                  { value: 10, position: 0.5 },
                  { value: 15, position: 0.75 },
                  { value: 20, position: 1.0 },
                ],
              },
              record: {
                value: 20,
                playerId: 'tom-brady',
              },
            },
            {
              id: 'post-season.rushing.first-downs',
              name: 'Rushing First Downs',
              meta: {
                domainMin: 0,
                domainMax: 50,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 12.5, position: 0.25 },
                  { value: 25, position: 0.5 },
                  { value: 37.5, position: 0.75 },
                  { value: 50, position: 1.0 },
                ],
              },
              record: {
                value: 3,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'post-season.rushing.fumbles',
              name: 'Rushing Fumbles',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 2.5, position: 0.25 },
                  { value: 5, position: 0.5 },
                  { value: 7.5, position: 0.75 },
                  { value: 10, position: 1.0 },
                ],
              },
              record: {
                value: 1,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'awards',
      name: 'Awards & Honors',
      subGroups: [
        {
          id: 'awards.individual',
          name: 'Individual Awards',
          columns: [
            {
              id: 'awards.individual.mvp',
              name: 'MVP Awards',
              meta: {
                domainMin: 0,
                domainMax: 5,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 1, position: 0.25 },
                  { value: 2, position: 0.5 },
                  { value: 3, position: 0.75 },
                  { value: 5, position: 1.0 },
                ],
              },
              record: {
                value: 3,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'awards.individual.sb-mvp',
              name: 'Super Bowl MVP Awards',
              meta: {
                domainMin: 0,
                domainMax: 5,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 1, position: 0.25 },
                  { value: 2, position: 0.5 },
                  { value: 3, position: 0.75 },
                  { value: 5, position: 1.0 },
                ],
              },
              record: {
                value: 1,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'awards.individual.pro-bowl',
              name: 'Pro Bowl Selections',
              meta: {
                domainMin: 0,
                domainMax: 15,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 4, position: 0.25 },
                  { value: 8, position: 0.5 },
                  { value: 12, position: 0.75 },
                  { value: 15, position: 1.0 },
                ],
              },
              record: {
                value: 9,
                playerId: 'peyton-manning',
              },
            },
            {
              id: 'awards.individual.all-pro',
              name: 'All-Pro Selections',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 2.5, position: 0.25 },
                  { value: 5, position: 0.5 },
                  { value: 7.5, position: 0.75 },
                  { value: 10, position: 1.0 },
                ],
              },
              record: {
                value: 7,
                playerId: 'peyton-manning',
              },
            },
          ],
        },
        {
          id: 'awards.team',
          name: 'Team Awards',
          columns: [
            {
              id: 'awards.team.sb-appearance',
              name: 'Super Bowl Appearances',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 1, position: 0.25 },
                  { value: 2, position: 0.5 },
                  { value: 3, position: 0.75 },
                  { value: 10, position: 1.0 },
                ],
              },
              record: {
                value: 10,
                playerId: 'tom-brady',
              },
            },
            {
              id: 'awards.team.sb-win',
              name: 'Super Bowl Wins',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
                labels: [
                  { value: 0, position: 0.0 },
                  { value: 3, position: 0.25 },
                  { value: 5, position: 0.5 },
                  { value: 8, position: 0.75 },
                  { value: 10, position: 1.0 },
                ],
              },
              record: {
                value: 7,
                playerId: 'tom-brady',
              },
            },
          ],
        },
      ],
    },
  ]);

  const scaleCache = new Map<string, d3.ScaleContinuousNumeric<number, number>>();
  const formatCache = new Map<string, (n: number) => string>();

  const getScale = (column: Column) => {
    const cacheKey = `${column.id}-${column.meta.scaleType}-${column.meta.domainMin}-${column.meta.domainMax}`;

    if (!scaleCache.has(cacheKey)) {
      const scale = (() => {
        switch (column.meta.scaleType) {
          case 'linear':
            return d3
              .scaleLinear()
              .domain([column.meta.domainMin, column.meta.domainMax])
              .range([0, 1]);
          case 'log':
            return d3
              .scaleLog()
              .domain([Math.max(1, column.meta.domainMin), column.meta.domainMax])
              .range([0, 1]);
          default:
            return d3
              .scaleLinear()
              .domain([column.meta.domainMin, column.meta.domainMax])
              .range([0, 1]);
        }
      })();

      scaleCache.set(cacheKey, scale);
    }

    return scaleCache.get(cacheKey)!;
  };

  const getFormat = (column: Column) => {
    const cacheKey = `${column.id}-${column.meta.formatType}`;

    if (!formatCache.has(cacheKey)) {
      const formatter = (() => {
        switch (column.meta.formatType) {
          case 'number':
            return (n: number) => `${n}`;
          default:
            return (n: number) => `${n}`;
        }
      })();

      formatCache.set(cacheKey, formatter);
    }

    return formatCache.get(cacheKey)!;
  };

  const selectableColumns = computed(() => {
    return statGroups.value.flatMap((group: Group) =>
      group.subGroups.flatMap((subGroup) => subGroup.columns.map(({ id, name }) => ({ id, name })))
    );
  });

  const selectableColumnsGroupedByGroupKey = computed(() => {
    return statGroups.value.map((group: Group) => ({
      id: group.id,
      name: group.name,
      columns: group.subGroups.flatMap((subGroup) =>
        subGroup.columns.map(({ id, name }) => ({ id, name }))
      ),
    }));
  });

  // Getter for a single column's enriched data
  const getEnrichedColumn = (column: Column) => ({
    ...column,
    meta: {
      ...column.meta,
      scale: getScale(column),
      format: getFormat(column),
    },
  });

  // Computed property that uses the cached functions
  const enrichedStatGroups = computed(() =>
    statGroups.value.map((group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup) => ({
        ...subGroup,
        columns: subGroup.columns.map(getEnrichedColumn),
      })),
    }))
  );

  onUnmounted(() => {
    scaleCache.clear();
    formatCache.clear();
  });

  return {
    statGroups: enrichedStatGroups,
    selectableColumns,
    selectableColumnsGroupedByGroupKey,
  };
});
