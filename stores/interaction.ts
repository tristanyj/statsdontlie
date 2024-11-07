import type { EnrichedStat } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isStatHovered = ref(false);
    const hoveredStat = ref<EnrichedStat | null>(null);

    const setHoveredStat = (stat: EnrichedStat | null) => {
      if (!stat) {
        isStatHovered.value = false;
        hoveredStat.value = null;
        return;
      }

      isStatHovered.value = true;
      hoveredStat.value = stat;
    };

    const parsedHoveredStat = computed(() => {
      if (!hoveredStat.value) return null;

      return {
        id: hoveredStat.value.id,
        name: hoveredStat.value.name,
        color: hoveredStat.value.color,
        record: hoveredStat.value.record,
      };
    });

    return {
      isStatHovered,
      hoveredStat: parsedHoveredStat,
      setHoveredStat,
    };
  }
  // { persist: true }
);
