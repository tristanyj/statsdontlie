<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const { drawStatLabelArcs, drawStatArcs, drawGroupArcs, drawOutsideMaxStatScaleArc } =
  useChartDrawArcs();
const { drawCircularSeparators, drawLinearSeparators } = useChartDrawLines();
const { drawStatLabels, drawScaleLabels, drawGroupLabels } = useChartDrawLabels();
const { drawStatIntersectionPoints } = useChartDrawPoints();
const { drawCenter } = useChartDrawCenter();
const { scales, updateScale } = useChartScales();

const interactionStore = useInteractionStore();
const { hoveredPlayer, mousePosition, tooltipData } = storeToRefs(interactionStore);

const configStore = useConfigStore();
const {
  selectedPlayers,
  selectedPlayerIds,
  selectedStatIds,
  selectedStatIdsCount,
  selectedGroups,
  selectedSubGroups,
  selectedStats,
} = storeToRefs(configStore);

const indices = computed(() => {
  let currentIndex = 0;
  const groupIndices: number[] = [];
  const subGroupIndices: number[] = [];

  selectedGroups.value.forEach((group) => {
    groupIndices.push(currentIndex);
    group.subCategories.forEach((subGroup) => {
      subGroupIndices.push(currentIndex);
      currentIndex += subGroup.stats.length;
    });
  });

  return { group: groupIndices, subGroup: subGroupIndices };
});

updateScale('circle', selectedStatIdsCount.value);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);

function createVisualization() {
  if (!g.value) return;
  g.value.selectAll('*').remove();

  // -----------------
  // ARCS
  // -----------------

  // Draw group and sub-group arcs
  // drawGroupArcs(g.value, scales.circle, indices.value.group, selectedGroups.value, 0);
  drawGroupArcs(g.value, scales.circle, indices.value.subGroup, selectedSubGroups.value, 1);

  // Draw stat & stat label arcs
  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value);
  drawStatLabelArcs(g.value, scales.circle, selectedStats.value);

  drawOutsideMaxStatScaleArc(g.value);

  // -----------------
  // LABELS
  // -----------------

  // Draw group and sub-group labels
  drawGroupLabels(
    g.value,
    scales.circle,
    indices.value.group,
    selectedStatIdsCount.value,
    selectedGroups.value,
    true
  );
  drawGroupLabels(
    g.value,
    scales.circle,
    indices.value.subGroup,
    selectedStatIdsCount.value,
    selectedSubGroups.value,
    false
  );

  // Draw scale and stat labels
  drawStatLabels(g.value, scales.circle, selectedStats.value);
  drawScaleLabels(g.value, scales.circle, selectedStats.value);

  // -----------------
  // LINES
  // -----------------

  // Draw linear and circular separators
  drawLinearSeparators(
    g.value,
    scales.circle,
    indices.value.group,
    indices.value.subGroup,
    selectedStatIdsCount.value
  );
  drawCircularSeparators(g.value);

  // -----------------
  // POINTS
  // -----------------

  drawStatIntersectionPoints(g.value, scales.circle, selectedStatIdsCount.value);

  // -----------------
  // HIDDEN
  // -----------------

  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value, true);
}

function updateDonutCenter() {
  if (!g.value) return;

  drawCenter(g.value, hoveredPlayer.value);
}

function updateVisualization() {
  if (!container.value) return;

  createVisualization();
}

const mountToContainer = () => {
  if (!container.value) {
    return;
  }

  d3.select(container.value).selectAll('*').remove();
  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'mx-auto');
  g.value = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  createVisualization();
};

watch(
  () => hoveredPlayer.value,
  () => {
    updateDonutCenter();
  }
);

watch(
  () => selectedStatIds.value,
  () => {
    updateVisualization();
  },
  { deep: true }
);

watch(
  () => selectedPlayerIds.value,
  () => {
    updateVisualization();
  },
  { deep: true }
);

watch(
  () => selectedStatIdsCount.value,
  (count) => {
    updateScale('circle', count);
    createVisualization();
  }
);

onMounted(() => {
  mountToContainer();
});
</script>

<template>
  <div>
    <VisualisationTooltip
      :tooltip-data="tooltipData"
      :mouse-position="mousePosition"
    />
    <div
      id="container"
      ref="container"
    />
  </div>
</template>
