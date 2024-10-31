export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedQBs = ref<string[]>([]);

    const updateSelectedQBs = (newSelectedQBs: string[]) => {
      selectedQBs.value = newSelectedQBs;
    };

    return {
      selectedQBs,
      updateSelectedQBs,
    };
  }
  // { persist: true }
);
