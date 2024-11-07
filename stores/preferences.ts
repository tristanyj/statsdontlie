import type { StatKey, PlayerKey } from '~/types';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedPlayerIds = ref<PlayerKey[]>(['aaron-rodgers', 'tom-brady', 'patrick-mahomes']);

    const selectedStatIds = ref<StatKey[]>([
      'regular-season.general.games',
      'regular-season.passing.completions',
      'regular-season.passing.attempts',
      'regular-season.passing.completion-percentage',
      'regular-season.passing.yards',
      'regular-season.passing.touchdowns',
      'regular-season.passing.interceptions',
      'regular-season.passing.rating',
      'regular-season.passing.sacks',
      'regular-season.passing.fumbles',
      'regular-season.rushing.attempts',
      'regular-season.rushing.yards',
      'regular-season.rushing.touchdowns',
      'post-season.general.games',
      'post-season.passing.completions',
      'post-season.passing.attempts',
      'post-season.passing.completion-percentage',
      'post-season.passing.yards',
      'post-season.passing.touchdowns',
      'post-season.passing.interceptions',
      'post-season.passing.rating',
      'post-season.passing.sacks',
      'post-season.passing.fumbles',
      'post-season.rushing.attempts',
      'post-season.rushing.yards',
      'post-season.rushing.touchdowns',
      'awards.individual.mvp',
      'awards.individual.sb-mvp',
      'awards.individual.pro-bowl',
      'awards.individual.all-pro-first',
      'awards.individual.all-pro-second',
      'awards.team.sb-appearance',
      'awards.team.sb-win',
    ]);

    const updateselectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) => {
      selectedPlayerIds.value = newselectedPlayerIds;
    };

    const updateSelectedStatIds = (newselectedStatIds: StatKey[]) => {
      selectedStatIds.value = newselectedStatIds;
    };

    const selectedStatIdsCount = computed(() => selectedStatIds.value.length);

    return {
      selectedPlayerIds,
      selectedStatIds,
      selectedStatIdsCount,
      updateselectedPlayerIds,
      updateSelectedStatIds,
    };
  }
  // { persist: true }
);
