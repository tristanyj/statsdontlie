import * as d3 from 'd3';
import type { Column, EnrichedColumn, EnrichedGroup, Group } from '~/types';

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
                domainMax: 400,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 335,
                  name: 'Tom Brady',
                },
                all: {
                  value: 382,
                  name: 'Morten Andersen',
                  position: 'K',
                },
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
                domainMax: 8000,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 7753,
                  name: 'Tom Brady',
                },
                all: {
                  value: 7753,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.attempts',
              name: 'Attempts',
              meta: {
                domainMin: 0,
                domainMax: 13000,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 12050,
                  name: 'Tom Brady',
                },
                all: {
                  value: 12050,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.completion-percentage',
              name: 'Completion %',
              meta: {
                domainMin: 50,
                domainMax: 70,
                scaleType: 'linear',
                formatType: 'percent',
              },
              record: {
                qb: {
                  value: 68.3,
                  name: 'Joe Burrow',
                },
                all: {
                  value: 68.3,
                  name: 'Joe Burrow',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.yards',
              name: 'Passing Yards',
              meta: {
                domainMin: 1000,
                domainMax: 90000,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 89214,
                  name: 'Tom Brady',
                },
                all: {
                  value: 89214,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.touchdowns',
              name: 'Passing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 700,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 649,
                  name: 'Peyton Manning',
                },
                all: {
                  value: 649,
                  name: 'Peyton Manning',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.interceptions',
              name: 'Interceptions',
              meta: {
                domainMin: 0,
                domainMax: 400,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 336,
                  name: 'Brett Favre',
                },
                all: {
                  value: 336,
                  name: 'Brett Favre',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.rating',
              name: 'Passer Rating',
              meta: {
                domainMin: 80,
                domainMax: 110,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 103.0,
                  name: 'Aaron Rodgers',
                },
                all: {
                  value: 103.0,
                  name: 'Aaron Rodgers',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.sacks',
              name: 'Sacks Taken',
              meta: {
                domainMin: 0,
                domainMax: 600,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 570,
                  name: 'Fran Tarkenton',
                },
                all: {
                  value: 570,
                  name: 'Fran Tarkenton',
                  position: 'QB',
                },
              },
            },
            {
              id: 'regular-season.passing.fumbles',
              name: 'Fumbles',
              meta: {
                domainMin: 0,
                domainMax: 200,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 166,
                  name: 'Brett Favre',
                },
                all: {
                  value: 166,
                  name: 'Brett Favre',
                  position: 'QB',
                },
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
                domainMax: 1200,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 1118,
                  name: 'Cam Newton',
                },
                all: {
                  value: 4409,
                  name: 'Emmitt Smith',
                  position: 'RB',
                },
              },
            },
            {
              id: 'regular-season.rushing.yards',
              name: 'Rushing Yards',
              meta: {
                domainMin: 0,
                domainMax: 6200,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 6109,
                  name: 'Michael Vick',
                },
                all: {
                  value: 18355,
                  name: 'Emmitt Smith',
                  position: 'RB',
                },
              },
            },
            {
              id: 'regular-season.rushing.touchdowns',
              name: 'Rushing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 100,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 75,
                  name: 'Cam Newton',
                },
                all: {
                  value: 164,
                  name: 'Emmitt Smith',
                  position: 'RB',
                },
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
              },
              record: {
                qb: {
                  value: 48,
                  name: 'Tom Brady',
                },
                all: {
                  value: 48,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
                domainMax: 1300,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 1200,
                  name: 'Tom Brady',
                },
                all: {
                  value: 1200,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
              },
              record: {
                qb: {
                  value: 1921,
                  name: 'Tom Brady',
                },
                all: {
                  value: 1921,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.completion-percentage',
              name: 'Completion %',
              meta: {
                domainMin: 50,
                domainMax: 70,
                scaleType: 'linear',
                formatType: 'percent',
              },
              record: {
                qb: {
                  value: 68.1,
                  name: 'Nick Foles',
                },
                all: {
                  value: 68.1,
                  name: 'Nick Foles',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.yards',
              name: 'Passing Yards',
              meta: {
                domainMin: 0,
                domainMax: 14000,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 13400,
                  name: 'Tom Brady',
                },
                all: {
                  value: 13400,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.touchdowns',
              name: 'Passing Touchdowns',
              meta: {
                domainMin: 0,
                domainMax: 90,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 88,
                  name: 'Tom Brady',
                },
                all: {
                  value: 88,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
              },
              record: {
                qb: {
                  value: 40,
                  name: 'Tom Brady',
                },
                all: {
                  value: 40,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.rating',
              name: 'Passer Rating',
              meta: {
                domainMin: 80,
                domainMax: 110,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 105.8,
                  name: 'Patrick Mahomes',
                },
                all: {
                  value: 105.8,
                  name: 'Patrick Mahomes',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.sacks',
              name: 'Sacks Taken',
              meta: {
                domainMin: 0,
                domainMax: 90,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 81,
                  name: 'Tom Brady',
                },
                all: {
                  value: 81,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'post-season.passing.fumbles',
              name: 'Fumbles',
              meta: {
                domainMin: 0,
                domainMax: 20,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 16,
                  name: 'Tom Brady',
                },
                all: {
                  value: 16,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
                domainMax: 120,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 114,
                  name: 'Tom Brady',
                },
                all: {
                  value: 400,
                  name: 'Franco Harris',
                  position: 'RB',
                },
              },
            },
            {
              id: 'post-season.rushing.yards',
              name: 'Rushing Yards',
              meta: {
                domainMin: 0,
                domainMax: 600,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 594,
                  name: 'Steve Young',
                },
                all: {
                  value: 1586,
                  name: 'Emmitt Smith',
                  position: 'RB',
                },
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
              },
              record: {
                qb: {
                  value: 8,
                  name: 'Steve Young',
                },
                all: {
                  value: 19,
                  name: 'Emmitt Smith',
                  position: 'RB',
                },
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
              },
              record: {
                qb: {
                  value: 5,
                  name: 'Peyton Manning',
                },
                all: {
                  value: 5,
                  name: 'Peyton Manning',
                  position: 'QB',
                },
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
              },
              record: {
                qb: {
                  value: 5,
                  name: 'Tom Brady',
                },
                all: {
                  value: 5,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
              },
              record: {
                qb: {
                  value: 15,
                  name: 'Tom Brady',
                },
                all: {
                  value: 15,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
            {
              id: 'awards.individual.all-pro-first',
              name: '1st Team All-Pro Selections',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 7,
                  name: 'Peyton Manning',
                },
                all: {
                  value: 10,
                  name: 'Jerry Rice | Jim Otto',
                  position: 'WR | C',
                },
              },
            },
            {
              id: 'awards.individual.all-pro-second',
              name: '2nd Team All-Pro Selections',
              meta: {
                domainMin: 0,
                domainMax: 10,
                scaleType: 'linear',
                formatType: 'number',
              },
              record: {
                qb: {
                  value: 3,
                  name: 'Many Players',
                },
                all: {
                  value: 10,
                  name: 'Ken Houston',
                  position: 'S',
                },
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
              },
              record: {
                qb: {
                  value: 10,
                  name: 'Tom Brady',
                },
                all: {
                  value: 10,
                  name: 'Tom Brady',
                  position: 'QB',
                },
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
              },
              record: {
                qb: {
                  value: 7,
                  name: 'Tom Brady',
                },
                all: {
                  value: 7,
                  name: 'Tom Brady',
                  position: 'QB',
                },
              },
            },
          ],
        },
      ],
    },
  ]);

  const scaleCache = new Map<
    string,
    d3.ScaleContinuousNumeric<number, number> | d3.ScaleThreshold<number, number>
  >();
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
              .domain([column.meta.domainMin, column.meta.domainMax])
              .range([0, 1]);
          case 'pow':
            return d3
              .scalePow()
              .domain([column.meta.domainMin, column.meta.domainMax])
              .range([0, 1])
              .exponent(0.5);

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

  const getEnrichedColumn = (column: Column): EnrichedColumn => ({
    ...column,
    meta: {
      ...column.meta,
      scale: getScale(column),
      format: getFormat(column),
    },
  });

  const enrichedStatGroups = computed(
    () =>
      statGroups.value.map((group) => ({
        ...group,
        subGroups: group.subGroups.map((subGroup) => ({
          ...subGroup,
          columns: subGroup.columns.map(getEnrichedColumn),
        })),
      })) as EnrichedGroup[]
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
