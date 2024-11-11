import type { Player, TooltipData } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isPlayerHovered = ref(false);
    const hoveredPlayer = ref<Player | null>(null);

    const tooltipData = ref<TooltipData | null>();
    const mousePosition = ref({ x: 0, y: 0 });
    const scrollPosition = ref({ x: 0, y: 0 });

    const setHoveredPlayer = (player: Player | null) => {
      if (!player) {
        isPlayerHovered.value = false;
        hoveredPlayer.value = null;
        return;
      }

      isPlayerHovered.value = true;
      hoveredPlayer.value = player;
    };

    const updateMousePosition = (event: MouseEvent) => {
      mousePosition.value = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    // Separate scroll tracking
    const updateScrollPosition = (x: number, y: number) => {
      scrollPosition.value = {
        x,
        y,
      };
    };

    const setTooltipData = (data: TooltipData | null) => {
      tooltipData.value = data;
    };

    return {
      isPlayerHovered,
      hoveredPlayer,
      mousePosition,
      scrollPosition,
      tooltipData,
      setHoveredPlayer,
      updateMousePosition,
      updateScrollPosition,
      setTooltipData,
    };
  }
  // { persist: true }
);
