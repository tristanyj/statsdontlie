import type { Player, PlayerKey } from '~/types';
import { heightToInches } from '~/assets/scripts/utils';
import {
  DEFAULT_PLAYER_IDS,
  POSITION_EQUIVALENT,
  HEIGHT_RANGE,
  WEIGHT_RANGE,
  YEARS_RANGE,
  PLAYER_SORT_OPTIONS,
} from '~/assets/scripts/constants';

export const usePlayerConfigStore = defineStore('config/player', () => {
  const configStore = useConfigStore();
  const { searchInput } = storeToRefs(configStore);

  // --------------------------------
  // State
  // --------------------------------

  const players = ref<Player[]>([]);
  const selectedPlayerIds = ref<PlayerKey[]>([...DEFAULT_PLAYER_IDS]);

  // --------------------------------
  // Computed
  // --------------------------------

  const isSortAscending = ref(false);
  const currentSort = ref(PLAYER_SORT_OPTIONS[1]);

  const isLoaded = computed(() => players.value.length > 0);

  const selectedPlayers = computed(() =>
    players.value.filter((player) => selectedPlayerIds.value.includes(player.id))
  );

  const selectedPlayerIdsCount = computed(() => selectedPlayerIds.value.length);

  const selectablePlayers = computed(() => {
    return players.value.map(({ id, color, info, stats }) => ({
      id,
      color,
      info,
      stats: {
        winShares: stats['regular_season.advanced.win_shares'],
      },
    }));
  });

  // --------------------------------
  // Methods
  // --------------------------------

  const setPlayers = (d: Player[]) =>
    (players.value = d.map((player) => ({
      ...player,
      info: {
        ...player.info,
        nickname: player.info.nickname.split(',')[0],
        teams: typeof player.info.teams === 'string' ? [player.info.teams] : player.info.teams,
        draft: player.id === 'malonmo01' ? [5, 1976] : player.info.draft,
      },
    })));

  const setSelectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) =>
    (selectedPlayerIds.value = newselectedPlayerIds);

  const restoreDefaultPlayerSelection = () => {
    selectedPlayerIds.value = [...DEFAULT_PLAYER_IDS];
  };

  const filteredPlayers = computed(() => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredBySearch = searchTerm
      ? selectablePlayers.value.filter((player) =>
          player.info.name.toLowerCase().includes(searchTerm)
        )
      : selectablePlayers.value;

    const filteredBySelected = filters.value.selectedOnly
      ? filteredBySearch.filter((player) => selectedPlayerIds.value.includes(player.id))
      : filteredBySearch;

    const filteredByHeight = filteredBySelected.filter((player) => {
      const height = heightToInches(player.info.height);
      return height >= heightMin.value && height <= heightMax.value;
    });

    const filteredByWeight = filteredByHeight.filter((player) => {
      const weight = parseInt(player.info.weight);
      return weight >= weightMin.value && weight <= weightMax.value;
    });

    const filteredByYears = filteredByWeight.filter((player) => {
      const endYear = player.info.draft[1] + player.info.experience;
      return endYear >= yearsMin.value && endYear <= yearsMax.value;
    });

    const selectedPositions = Object.entries(filters.value.positions)
      .filter((position) => position[1])
      .map((position) => position[0]);

    const filteredByPosition = selectedPositions.length
      ? filteredByYears.filter((player) => {
          return selectedPositions.some((position) => {
            const equivalent = POSITION_EQUIVALENT[position as keyof typeof POSITION_EQUIVALENT];
            return !!equivalent && player.info.position === equivalent;
          });
        })
      : [];

    return filteredByPosition;
  });

  const filters = ref({
    selectedOnly: false,
    heightRange: [HEIGHT_RANGE[0], HEIGHT_RANGE[1]],
    weightRange: [WEIGHT_RANGE[0], WEIGHT_RANGE[1]],
    yearsRange: [YEARS_RANGE[0], YEARS_RANGE[1]],
    positions: {
      PG: true,
      SG: true,
      SF: true,
      PF: true,
      C: true,
    },
  });

  const heightMin = computed(() =>
    Math.min(filters.value.heightRange[0], filters.value.heightRange[1])
  );
  const heightMax = computed(() =>
    Math.max(filters.value.heightRange[0], filters.value.heightRange[1])
  );

  const weightMin = computed(() =>
    Math.min(filters.value.weightRange[0], filters.value.weightRange[1])
  );
  const weightMax = computed(() =>
    Math.max(filters.value.weightRange[0], filters.value.weightRange[1])
  );

  const yearsMin = computed(() =>
    Math.min(filters.value.yearsRange[0], filters.value.yearsRange[1])
  );
  const yearsMax = computed(() =>
    Math.max(filters.value.yearsRange[0], filters.value.yearsRange[1])
  );

  const isFiltered = computed(() => {
    return (
      filters.value.selectedOnly ||
      filters.value.heightRange[0] !== HEIGHT_RANGE[0] ||
      filters.value.heightRange[1] !== HEIGHT_RANGE[1] ||
      filters.value.weightRange[0] !== WEIGHT_RANGE[0] ||
      filters.value.weightRange[1] !== WEIGHT_RANGE[1] ||
      filters.value.yearsRange[0] !== YEARS_RANGE[0] ||
      filters.value.yearsRange[1] !== YEARS_RANGE[1] ||
      Object.values(filters.value.positions).some((position) => !position)
    );
  });

  const clearFilters = () => {
    filters.value = {
      selectedOnly: false,
      heightRange: [HEIGHT_RANGE[0], HEIGHT_RANGE[1]],
      weightRange: [WEIGHT_RANGE[0], WEIGHT_RANGE[1]],
      yearsRange: [YEARS_RANGE[0], YEARS_RANGE[1]],
      positions: {
        PG: true,
        SG: true,
        SF: true,
        PF: true,
        C: true,
      },
    };
  };

  const selectAllFilteredPlayers = () => {
    setSelectedPlayerIds(filteredPlayers.value.map((player) => player.id));
  };

  const sortedPlayers = computed(() => {
    const copy = [...filteredPlayers.value];

    switch (currentSort.value.key) {
      case 'name':
        return copy.sort((a, b) => {
          const [aFirstName, aLastName] = a.info.name.split(' ');
          const [bFirstName, bLastName] = b.info.name.split(' ');

          return isSortAscending.value
            ? aLastName.localeCompare(bLastName) || aFirstName.localeCompare(bFirstName)
            : bLastName.localeCompare(aLastName) || bFirstName.localeCompare(aFirstName);
        });
      case 'win-shares':
        return copy.sort((a, b) => {
          return isSortAscending.value
            ? a.stats.winShares - b.stats.winShares
            : b.stats.winShares - a.stats.winShares;
        });
      case 'height':
        return copy.sort((a, b) => {
          const aHeight = heightToInches(a.info.height);
          const bHeight = heightToInches(b.info.height);

          return isSortAscending.value ? aHeight - bHeight : bHeight - aHeight;
        });
      case 'weight':
        return copy.sort((a, b) => {
          const aWeight = parseInt(a.info.weight);
          const bWeight = parseInt(b.info.weight);

          return isSortAscending.value ? aWeight - bWeight : bWeight - aWeight;
        });
      case 'experience':
        return copy.sort((a, b) => {
          return isSortAscending.value
            ? a.info.experience - b.info.experience
            : b.info.experience - a.info.experience;
        });
      case 'draft-year':
        return copy.sort((a, b) => {
          return isSortAscending.value
            ? a.info.draft[1] - b.info.draft[1]
            : b.info.draft[1] - a.info.draft[1];
        });
      default:
        return copy;
    }
  });

  return {
    isLoaded,
    isSortAscending,
    currentSort,
    filters,
    isFiltered,
    selectedPlayerIds,
    selectedPlayerIdsCount,
    selectablePlayers,
    selectedPlayers,
    filteredPlayers,
    sortedPlayers,
    setPlayers,
    setSelectedPlayerIds,
    restoreDefaultPlayerSelection,
    selectAllFilteredPlayers,
    clearFilters,
  };
});
