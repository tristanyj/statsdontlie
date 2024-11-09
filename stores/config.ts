import * as d3 from 'd3';
import type {
  Stat,
  EnrichedStat,
  EnrichedGroup,
  Category,
  Player,
  StatKey,
  PlayerKey,
} from '~/types';

import { formatNumber } from '~/assets/scripts/utils';

export const useConfigStore = defineStore('config', () => {
  const statGroups = ref<Category[]>([]);
  const players = ref<Player[]>([]);

  const selectedPlayerIds = ref<PlayerKey[]>([]);
  const selectedStatIds = ref<StatKey[]>([]);

  const selectedStatIdsCount = computed(() => selectedStatIds.value.length);

  const updateselectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) => {
    selectedPlayerIds.value = newselectedPlayerIds;
  };

  const updateSelectedStatIds = (newselectedStatIds: StatKey[]) => {
    selectedStatIds.value = newselectedStatIds;
  };

  const scaleCache = new Map<
    string,
    d3.ScaleContinuousNumeric<number, number> | d3.ScaleThreshold<number, number>
  >();
  const formatCache = new Map<string, (n: number, decimals: number) => string>();

  const getScale = (column: Stat) => {
    const cacheKey = `${column.id}-${column.meta.scaleType}-${column.meta.domain}`;

    if (!scaleCache.has(cacheKey)) {
      const scale = (() => {
        switch (column.meta.scaleType) {
          case 'linear':
            return d3.scaleLinear().domain(column.meta.domain).range([0, 1]);
          // case 'log':
          //   return d3
          //     .scaleLog()
          //     .domain(column.meta.domain)
          //     .range([0, 1]);
          // case 'pow':
          //   return d3
          //     .scalePow()
          //     .domain(column.meta.domain)
          //     .range([0, 0]);
          //     .exponent(0.5);
          default:
            return d3.scaleLinear().domain(column.meta.domain).range([0, 1]);
        }
      })();

      scaleCache.set(cacheKey, scale);
    }

    return scaleCache.get(cacheKey)!;
  };

  const getFormat = (column: Stat) => {
    const cacheKey = `${column.id}-${column.meta.formatType}`;

    if (!formatCache.has(cacheKey)) {
      const formatter = (() => {
        switch (column.meta.formatType) {
          case 'number':
            return (n: number, decimals: number) => formatNumber(n, decimals);
          // case 'percent':
          //   return (n: number, decimals: number) => `${n.toFixed(decimals ?? 1)}%`;
          default:
            return (n: number) => formatNumber(n);
        }
      })();

      formatCache.set(cacheKey, formatter);
    }

    return formatCache.get(cacheKey)!;
  };

  const selectablePlayers = computed(() => {
    return players.value.map(({ id, info }) => ({ id, name: info.name }));
  });

  const selectableStats = computed(() => {
    return statGroups.value.flatMap((group: Category) =>
      group.subCategories.flatMap((subGroup) =>
        subGroup.stats.map(({ id, name }) => ({ id, name }))
      )
    );
  });

  const selectableStatsGroupedByGroupKey = computed(() => {
    return statGroups.value.map((group: Category) => ({
      id: group.id,
      name: group.name,
      stats: group.subCategories.flatMap((subGroup) =>
        subGroup.stats.map(({ id, name }) => ({ id, name }))
      ),
    }));
  });

  const getEnrichedStat = (column: Stat, color: `#${string}`): EnrichedStat => ({
    ...column,
    color,
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
        subCategories: group.subCategories.map((subGroup) => ({
          ...subGroup,
          stats: subGroup.stats.map((column) => getEnrichedStat(column, subGroup.color)),
        })),
      })) as EnrichedGroup[]
  );

  const setStatGroups = (groups: Category[]) => {
    statGroups.value = groups;
  };

  const setPlayers = (data: Player[]) => {
    players.value = data;
  };

  onUnmounted(() => {
    scaleCache.clear();
    formatCache.clear();
  });

  const selectedPlayers = computed(() =>
    players.value.filter((player) => selectedPlayerIds.value.includes(player.id))
  );

  const selectedGroups = computed(() => {
    return enrichedStatGroups?.value
      ? enrichedStatGroups.value
          .map((group) => ({
            ...group,
            subCategories: group.subCategories
              .map((subGroup) => ({
                ...subGroup,
                stats: subGroup.stats.filter((column) => selectedStatIds.value.includes(column.id)),
              }))
              .filter((subGroup) => subGroup.stats.length > 0),
          }))
          .filter((group) => group.subCategories.length > 0)
      : [];
  });

  const selectedSubGroups = computed(() => {
    return selectedGroups.value.flatMap((group) => group.subCategories);
  });

  const selectedStats = computed(() => {
    return selectedGroups.value
      .flatMap((group) => group.subCategories)
      .flatMap((subGroup) => subGroup.stats);
  });

  return {
    selectedPlayerIds,
    selectedStatIds,
    players,
    selectedStatIdsCount,
    updateselectedPlayerIds,
    updateSelectedStatIds,
    statGroups: enrichedStatGroups,
    selectableStats,
    selectableStatsGroupedByGroupKey,
    selectablePlayers,
    selectedPlayers,
    selectedGroups,
    selectedSubGroups,
    selectedStats,
    setStatGroups,
    setPlayers,
  };
});
