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
          ],
        },
      ],
    },
    {
      id: 'post-season',
      name: 'Post Season',
      subGroups: [
        {
          id: 'post-season.passing',
          name: 'Passing',
          columns: [
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
