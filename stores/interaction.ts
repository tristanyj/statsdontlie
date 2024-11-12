import type { Category, Player, SubCategory, TooltipStat, ToolTipStatLabel } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isPlayerHovered = ref(false);
    const hoveredPlayer = ref<Player | null>(null);

    const hoveredCategory = ref<Category | SubCategory | null>(null);

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

    const setHoveredCategory = (category: Category | SubCategory | null) => {
      hoveredCategory.value = category;
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
      hoveredCategory,
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
      setHoveredCategory,
    };
  }
  // { persist: true }
);
