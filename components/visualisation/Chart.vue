<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const {
  drawCircleBackground,
  drawStatLabelArcs,
  drawStatArcs,
  drawGroupArcs,
  drawOutsideMaxStatScaleArc,
} = useChartDrawArcs();
const { drawCircularSeparators, drawLinearSeparators } = useChartDrawLines();
const { drawStatLabels, drawScaleLabels, drawGroupLabels } = useChartDrawLabels();
const { drawStatIntersectionPoints } = useChartDrawPoints();
const { drawCenter } = useChartDrawCenter();
const { scales, updateScale } = useChartScales();

const interactionStore = useInteractionStore();
const { mousePosition, tooltipData } = storeToRefs(interactionStore);
const { updateMousePosition, updateScrollPosition } = interactionStore;

const configStore = useConfigStore();
const {
  selectedPlayers,
  selectedPlayerIds,
  selectedStatIds,
  selectedStatIdsCount,
  selectedCategories,
  selectedSubCategories,
  selectedStats,
} = storeToRefs(configStore);

const indices = computed(() => {
  let currentIndex = 0;
  const categoryIndices: number[] = [];
  const subCategoryIndices: number[] = [];

  selectedCategories.value.forEach((category) => {
    categoryIndices.push(currentIndex);
    category.subCategories.forEach((subCategory) => {
      subCategoryIndices.push(currentIndex);
      currentIndex += subCategory.stats.length;
    });
  });

  return { group: categoryIndices, subCategory: subCategoryIndices };
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

  drawCircleBackground(g.value);

  // Draw group and sub-group arcs
  drawGroupArcs(g.value, scales.circle, indices.value.group, selectedCategories.value, 0);
  drawGroupArcs(g.value, scales.circle, indices.value.subCategory, selectedSubCategories.value, 1);

  // Draw stat & stat label arcs
  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value);
  drawStatLabelArcs(
    g.value,
    scales.circle,
    selectedStats.value,
    indices.value.subCategory,
    selectedSubCategories.value
  );

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
    selectedCategories.value,
    true
  );
  drawGroupLabels(
    g.value,
    scales.circle,
    indices.value.subCategory,
    selectedStatIdsCount.value,
    selectedSubCategories.value,
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
    indices.value.subCategory,
    selectedStatIdsCount.value
  );
  drawCircularSeparators(g.value);

  // -----------------
  // POINTS
  // -----------------

  drawStatIntersectionPoints(g.value, scales.circle, selectedStatIdsCount.value);

  // -----------------
  // CENTER
  // -----------------

  drawCenter(g.value);

  // -----------------
  // HIDDEN
  // -----------------

  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value, true);
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

function prepareScrollPosition() {
  updateScrollPosition(window.scrollX, window.scrollY);
}

onMounted(() => {
  mountToContainer();
  window.addEventListener('scroll', prepareScrollPosition);
  window.addEventListener('mousemove', updateMousePosition);
});

onUnmounted(() => {
  window.removeEventListener('scroll', prepareScrollPosition);
  window.removeEventListener('mousemove', updateMousePosition);
});
</script>

<template>
  <div class="relative z-10">
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
