import type { StatKey, PlayerKey } from '~/types';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedPlayerIds = ref<PlayerKey[]>(['aaron-rodgers', 'tom-brady', 'patrick-mahomes']);
    const selectedStatIds = ref<StatKey[]>([]);

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
