<script setup lang="ts">
import type { CSSProperties } from 'vue';

const interactionStore = useInteractionStore();
const { mousePosition, scrollPosition, tooltipData } = storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value || !scrollPosition.value) return {};

  // Combine mouse and scroll position for absolute positioning
  const posX = mousePosition.value.x;
  const posY = mousePosition.value.y;

  return {
    transform: `translate(${posX + 15}px, ${posY - 30}px)`,
    visibility: tooltipData.value ? 'visible' : 'hidden',
  };
});
</script>

<template>
  <!-- <Transition
    name="fade"
    mode="out-in"
  > -->
  <div
    v-show="tooltipData"
    class="fixed top-0 left-0 stat-tooltip p-2 bg-white border border-gray-500 rounded-md z-100 text-sm"
    :style="tooltipStyle"
  >
    <div class="tooltip-header">
      <div class="player-name">{{ tooltipData?.id }}</div>
      <!-- <div class="player-team">{{ tooltipData.player.team }}</div> -->
    </div>
    <div class="tooltip-content">
      <div class="stat-row">
        <!-- <span class="stat-label">{{ tooltipData.stat.name }}</span> -->
        <span class="stat-value">
          <!-- {{ tooltipData.stat.formatValue(tooltipData.value) }} -->
        </span>
      </div>
    </div>
  </div>
  <!-- </Transition> -->
</template>
