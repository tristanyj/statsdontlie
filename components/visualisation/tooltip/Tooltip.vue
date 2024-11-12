<script setup lang="ts">
import type { CSSProperties } from 'vue';

const interactionStore = useInteractionStore();
const { mousePosition, scrollPosition, isTooltipVisible, tooltipStat, tooltipStatLabel } =
  storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value || !scrollPosition.value) return {};

  // Combine mouse and scroll position for absolute positioning
  const posX = mousePosition.value.x;
  const posY = mousePosition.value.y;

  return {
    transform: `translate(${posX + 15}px, ${posY - 30}px)`,
    visibility: isTooltipVisible.value ? 'visible' : 'hidden',
  };
});
</script>

<template>
  <!-- <Transition
    name="fade"
    mode="out-in"
  > -->
  <div
    v-show="isTooltipVisible"
    class="fixed top-0 left-0 stat-tooltip bg-gray-50 border rounded-md z-100 text-sm font-host"
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
