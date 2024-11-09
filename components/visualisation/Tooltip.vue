<script setup lang="ts">
import type { TooltipData } from '@/types';
import type { CSSProperties } from 'vue';

// const interactionStore = useInteractionStore();
// const { hoveredPlayer, mousePosition, tooltipData } = storeToRefs(interactionStore);

const props = defineProps<{
  tooltipData: TooltipData | null | undefined;
  mousePosition: { x: number; y: number };
}>();

const tooltipStyle = computed<CSSProperties>(() => {
  if (!props.mousePosition) return {};

  return {
    position: 'fixed',
    transform: `translate(${props.mousePosition.x + 20}px, ${props.mousePosition.y - 70}px)`,
    visibility: props.tooltipData ? 'visible' : 'hidden',
  };
});
</script>

<template>
  <Transition
    name="fade"
    mode="out-in"
  >
    <div
      v-show="tooltipData"
      class="stat-tooltip p-4 bg-white border-1 rounded-md z-100 text-sm"
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
  </Transition>
</template>
