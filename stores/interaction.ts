import type { HoveredStatArc, StatArcData } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isStatHovered = ref(false);
    const hoveredStatArc = ref<StatArcData | null>(null);

    const setHoveredStat = (stat: StatArcData | null) => {
      if (!stat) {
        isStatHovered.value = false;
        hoveredStatArc.value = null;
        return;
      }

      isStatHovered.value = true;
      hoveredStatArc.value = stat;
    };

    const parsedHoveredStat = computed<HoveredStatArc | null>(() => {
      if (!hoveredStatArc.value) return null;

      return {
        id: hoveredStatArc.value.id,
        stat: {
          id: hoveredStatArc.value.stat.id,
          name: hoveredStatArc.value.stat.name,
          color: hoveredStatArc.value.stat.color,
          format: hoveredStatArc.value.stat.meta.format,
          formatType: hoveredStatArc.value.stat.meta.formatType,
          record: hoveredStatArc.value.stat.record,
        },
        player: {
          id: hoveredStatArc.value.player.id,
          name: hoveredStatArc.value.player.name,
          colors: hoveredStatArc.value.player.colors,
          stat: hoveredStatArc.value.player.stats[hoveredStatArc.value.stat.id],
        },
      } as HoveredStatArc;
    });

    return {
      isStatHovered,
      hoveredStatArc: parsedHoveredStat,
      setHoveredStat,
    };
  }
  // { persist: true }
);
