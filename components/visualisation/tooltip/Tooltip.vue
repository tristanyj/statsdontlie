<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';

const { width, height } = useWindowSize();

const interactionStore = useInteractionStore();
const { mousePosition, scrollPosition, isTooltipVisible, tooltipStat, tooltipStatLabel } =
  storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value || !scrollPosition.value) return {};

  const paddingX = 25;
  const paddingY = 25;

  // Check if mouse is near edges
  const isPastHalfWidth = mousePosition.value.x > width.value * 0.65;
  const isPastHalfHeight = mousePosition.value.y > height.value * 0.65;

  let posX, posY;

  // Handle bottom-right corner case
  if (isPastHalfWidth && isPastHalfHeight) {
    // Position tooltip to the left and above the cursor
    posX = mousePosition.value.x + paddingX;
    posY = mousePosition.value.y - tooltipSize.value.height - paddingY;
  } else {
    // Normal positioning for other cases
    posX = mousePosition.value.x + paddingX;
    posY = mousePosition.value.y + paddingY;
  }

  // Ensure tooltip stays within viewport bounds
  posX = Math.max(paddingX, Math.min(posX, width.value - tooltipSize.value.width - paddingX));
  posY = Math.max(paddingY, Math.min(posY, height.value - tooltipSize.value.height - paddingY));

  return {
    transform: `translate(${posX}px, ${posY}px)`,
    visibility: isTooltipVisible.value ? 'visible' : 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
  };
});

const tooltipSize = ref({ width: 0, height: 0 });
const tooltip = ref<HTMLElement | null>(null);

// Update size whenever tooltip content changes
watch(
  [tooltipStat, tooltipStatLabel, isTooltipVisible],
  async () => {
    if (!tooltip.value) return;

    // Wait for DOM update
    await nextTick();

    // Get the actual rendered size
    const rect = tooltip.value.getBoundingClientRect();
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  },
  { immediate: true }
);

// Optional: Update on window resize
useEventListener(window, 'resize', () => {
  if (!tooltip.value || !isTooltipVisible.value) return;

  const rect = tooltip.value.getBoundingClientRect();
  tooltipSize.value = {
    width: rect.width,
    height: rect.height,
  };
});

// Optional: ResizeObserver for more accurate size tracking
onMounted(() => {
  if (!tooltip.value) return;

  const resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  });

  resizeObserver.observe(tooltip.value);

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});
</script>

<template>
  <!-- <Transition
    name="fade"
    mode="out-in"
  > -->
  <div
    v-show="isTooltipVisible"
    ref="tooltip"
    class="fixed stat-tooltip bg-gray-50 border rounded-md z-100 text-sm font-host"
    :style="tooltipStyle"
  >
    <template v-if="tooltipStat">
      <VisualisationTooltipHeader
        :category-name="tooltipStat?.categoryName"
        :category-color="tooltipStat?.categoryColor"
        :sub-category-name="tooltipStat?.subCategoryName"
        :stat-name="tooltipStat?.statName"
        :stat-description="tooltipStat?.statDescription"
      />
      <VisualisationTooltipStat
        :id="tooltipStat?.playerId"
        :value="tooltipStat?.value"
        :name="tooltipStat?.playerName"
        :stat-name="tooltipStat?.statName"
        :color="tooltipStat?.playerColor"
      />
      <VisualisationTooltipRecord
        :value="tooltipStat?.record.value"
        :holder="tooltipStat?.record.holder"
      />
    </template>
    <template v-else-if="tooltipStatLabel">
      <VisualisationTooltipHeader
        :category-name="tooltipStatLabel?.categoryName"
        :category-color="tooltipStatLabel?.categoryColor"
        :sub-category-name="tooltipStatLabel?.subCategoryName"
        :stat-name="tooltipStatLabel?.statName"
        :stat-description="tooltipStatLabel?.statDescription"
      />
      <VisualisationTooltipRecord
        :value="tooltipStatLabel?.record.value"
        :holder="tooltipStatLabel?.record.holder"
      />
    </template>
  </div>
  <!-- </Transition> -->
</template>
