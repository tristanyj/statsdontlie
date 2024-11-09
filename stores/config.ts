import type {
  Stat,
  EnrichedStat,
  EnrichedCategory,
  Category,
  Player,
  StatKey,
  PlayerKey,
} from '~/types';

export const useConfigStore = defineStore('config', () => {
  const cacheStore = useCacheStore();
  const { getScale, getFormat } = cacheStore;

  // --------------------------------
  // State
  // --------------------------------

  const categories = ref<Category[]>([]);
  const players = ref<Player[]>([]);

  const selectedPlayerIds = ref<PlayerKey[]>(['abdulka01', 'jamesle01', 'chambwi01']);
  const selectedStatIds = ref<StatKey[]>([
    'awards.individual.mvp',
    'awards.team.nba_championships',
    'regular_season.total.points',
    'regular_season.total.total_rebounds',
    'regular_season.total.assists',
    'regular_season.total.steals',
    'regular_season.advanced.player_efficiency_rating',
    'regular_season.advanced.win_shares',
  ]);

  // --------------------------------
  // Computed
  // --------------------------------

  const isLoaded = computed(() => categories.value.length > 0 && players.value.length > 0);

  const selectedPlayers = computed(() =>
    players.value.filter((player) => selectedPlayerIds.value.includes(player.id))
  );

  const selectedCategories = computed(() => {
    return enrichedCategories?.value
      ? enrichedCategories.value
          .map((group) => ({
            ...group,
            subCategories: group.subCategories
              .map((subCategory) => ({
                ...subCategory,
                stats: subCategory.stats.filter((column) =>
                  selectedStatIds.value.includes(column.id)
                ),
              }))
              .filter((subCategory) => subCategory.stats.length > 0),
          }))
          .filter((group) => group.subCategories.length > 0)
      : [];
  });

  const selectedSubCategories = computed(() => {
    return selectedCategories.value.flatMap((group) => group.subCategories);
  });

  const selectedStats = computed(() => {
    return selectedCategories.value
      .flatMap((group) => group.subCategories)
      .flatMap((subCategory) => subCategory.stats);
  });

  const selectedPlayerIdsCount = computed(() => selectedPlayerIds.value.length);
  const selectedStatIdsCount = computed(() => selectedStatIds.value.length);

  const selectablePlayers = computed(() => {
    return players.value.map(({ id, info }) => ({ id, info }));
  });

  const selectableCategories = computed(() => {
    return categories.value.map(({ id, name, subCategories }) => ({
      id,
      name,
      subCategories: subCategories.map(({ id, name, stats }) => ({
        id,
        name,
        stats: stats.map(({ id, name }) => ({ id, name })),
      })),
    }));
  });

  const enrichedCategories = computed(
    () =>
      categories.value.map((category) => ({
        ...category,
        subCategories: category.subCategories.map((subCategory) => ({
          ...subCategory,
          stats: subCategory.stats.map((stat) => getEnrichedStat(stat, subCategory.color)),
        })),
      })) as EnrichedCategory[]
  );

  // --------------------------------
  // Methods
  // --------------------------------

  const getEnrichedStat = (stat: Stat, color: `#${string}`): EnrichedStat => ({
    ...stat,
    color,
    meta: {
      ...stat.meta,
      scale: getScale(stat),
      format: getFormat(stat),
    },
  });

  const setCategories = (d: Category[]) => (categories.value = d);
  const setPlayers = (d: Player[]) => (players.value = d);

  const setSelectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) =>
    (selectedPlayerIds.value = newselectedPlayerIds);
  const setSelectedStatIds = (newselectedStatIds: StatKey[]) =>
    (selectedStatIds.value = newselectedStatIds);

  return {
    isLoaded,
    selectedPlayerIds,
    selectedStatIds,
    selectedPlayerIdsCount,
    selectedStatIdsCount,
    selectablePlayers,
    selectableCategories,
    selectedPlayers,
    selectedCategories,
    selectedSubCategories,
    selectedStats,
    setCategories,
    setPlayers,
    setSelectedPlayerIds,
    setSelectedStatIds,
  };
});
