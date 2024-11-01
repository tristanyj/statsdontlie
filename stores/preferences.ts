import type { ColumnKey } from '~/types';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedQBs = ref<string[]>([]);
    const selectedColumns = ref<ColumnKey[]>([
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

    const updateSelectedQBs = (newSelectedQBs: string[]) => {
      selectedQBs.value = newSelectedQBs;
    };

    const updateSelectedColumns = (newSelectedColumns: ColumnKey[]) => {
      selectedColumns.value = newSelectedColumns;
    };

    const selectedColumnsCount = computed(() => selectedColumns.value.length);

    return {
      selectedQBs,
      selectedColumns,
      selectedColumnsCount,
      updateSelectedQBs,
      updateSelectedColumns,
    };
  },
  { persist: true }
);
