import type { Player, TooltipStat, ToolTipStatLabel } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isPlayerHovered = ref(false);
    const hoveredPlayer = ref<Player | null>(null);

    const isPickerOpen = ref(false);
    const pickerType = ref<'players' | 'stats'>('players');

    const tooltipStat = ref<TooltipStat | null>();
    const tooltipStatLabel = ref<ToolTipStatLabel | null>();

    const isTooltipVisible = computed(() => !!tooltipStat.value || !!tooltipStatLabel.value);

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

    const setTooltipStat = (data: TooltipStat | null) => {
      tooltipStat.value = data;
    };

    const setTooltipStatLabel = (data: ToolTipStatLabel | null) => {
      tooltipStatLabel.value = data;
    };

    const openPicker = (key: 'players' | 'stats') => {
      pickerType.value = key;
      isPickerOpen.value = true;
    };

    const setIsPickerOpen = (isOpen: boolean) => {
      isPickerOpen.value = isOpen;
    };

    return {
      isPlayerHovered,
      hoveredPlayer,
      pickerType,
      mousePosition,
      scrollPosition,
      tooltipStat,
      tooltipStatLabel,
      isPickerOpen,
      isTooltipVisible,
      openPicker,
      setIsPickerOpen,
      setHoveredPlayer,
      updateMousePosition,
      updateScrollPosition,
      setTooltipStat,
      setTooltipStatLabel,
    };
  }
  // { persist: true }
);
