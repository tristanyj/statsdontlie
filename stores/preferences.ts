import type { ColumnKey, PlayerKey } from '~/types';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedPlayerIds = ref<PlayerKey[]>(['aaron-rodgers']);

    const selectedColumnIds = ref<ColumnKey[]>([
      'regular-season.general.games',
      // 'regular-season.passing.completions',
      // 'regular-season.passing.attempts',
      // 'regular-season.passing.completion-percentage',
      'regular-season.passing.yards',
      'regular-season.passing.touchdowns',
      // 'regular-season.passing.interceptions',
      // 'regular-season.passing.rating',
      // 'regular-season.rushing.attempts',
      'regular-season.rushing.yards',
      'regular-season.rushing.touchdowns',
      'post-season.general.games',
      // 'post-season.passing.completions',
      // 'post-season.passing.attempts',
      // 'post-season.passing.completion-percentage',
      'post-season.passing.yards',
      'post-season.passing.touchdowns',
      // 'post-season.passing.interceptions',
      // 'post-season.passing.rating',
      // 'post-season.rushing.attempts',
      'post-season.rushing.yards',
      'post-season.rushing.touchdowns',
      'awards.individual.mvp',
      // 'awards.individual.sb-mvp',
      'awards.individual.pro-bowl',
      // 'awards.individual.all-pro',
      'awards.team.sb-appearance',
      'awards.team.sb-win',
    ]);

    const updateselectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) => {
      selectedPlayerIds.value = newselectedPlayerIds;
    };

    const updateSelectedColumnIds = (newselectedColumnIds: ColumnKey[]) => {
      selectedColumnIds.value = newselectedColumnIds;
    };

    const selectedColumnIdsCount = computed(() => selectedColumnIds.value.length);

    return {
      selectedPlayerIds,
      selectedColumnIds,
      selectedColumnIdsCount,
      updateselectedPlayerIds,
      updateSelectedColumnIds,
    };
  }
  // { persist: true }
);
