<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const {
  drawCircleBackground,
  drawOverlayArc,
  drawStatLabelArcs,
  drawStatArcs,
  drawGroupArcs,
  drawOutsideMaxStatScaleArc,
} = useChartDrawArcs();
const { drawCircularSeparators, drawLinearSeparators, drawDonutLine } = useChartDrawLines();
const { drawStatLabels, drawScaleLabels, drawGroupLabels } = useChartDrawLabels();
const { drawStatIntersectionPoints } = useChartDrawPoints();
const { drawCenterImage, drawBackground, drawCenter } = useChartDrawCenter();
const { scales, updateScale } = useChartScales();

const interactionStore = useInteractionStore();
const { hoveredCategory } = storeToRefs(interactionStore);
const { updateMousePosition, setHoveredCategory } = interactionStore;

const playerConfigStore = usePlayerConfigStore();
const statConfigStore = useStatConfigStore();

const { selectedPlayers, selectedPlayerIds } = storeToRefs(playerConfigStore);
const {
  selectedStatIds,
  selectedStatIdsCount,
  selectedCategories,
  selectedSubCategories,
  selectedStats,
} = storeToRefs(statConfigStore);

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

  drawBackground(g.value);

  // -----------------
  // ARCS
  // -----------------

  drawCircleBackground(g.value);

  drawGroupArcs(g.value, scales.circle, indices.value.group, selectedCategories.value, 0);
  drawGroupArcs(g.value, scales.circle, indices.value.subCategory, selectedSubCategories.value, 1);

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

  drawStatLabels(g.value, scales.circle, selectedStats.value);

  // -----------------
  // LINES
  // -----------------

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
  drawDonutLine(g.value);
  drawCenterImage(g.value);

  // -----------------
  // OVERLAY
  // -----------------

  drawScaleLabels(g.value, scales.circle, selectedStats.value);
  drawOverlayArc(
    g.value,
    scales.circle,
    hoveredCategory.value,
    selectedCategories.value,
    selectedSubCategories.value
  );

  // -----------------
  // HIDDEN
  // -----------------

  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value, true);
  drawStatLabelArcs(
    g.value,
    scales.circle,
    selectedStats.value,
    indices.value.subCategory,
    selectedSubCategories.value,
    true
  );
  drawGroupArcs(g.value, scales.circle, indices.value.group, selectedCategories.value, 0, true);
  drawGroupArcs(
    g.value,
    scales.circle,
    indices.value.subCategory,
    selectedSubCategories.value,
    1,
    true
  );
}

function updateVisualization() {
  if (!container.value) return;

  createVisualization();
}

const isLoading = ref(true);

const mountToContainer = () => {
  if (!container.value) {
    return;
  }

  d3.select(container.value).selectAll('*').remove();
  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'mx-auto');
  g.value = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  createVisualization();

  isLoading.value = false;
};

watch(
  () => hoveredCategory.value,
  () => {
    if (!g.value) return;
    drawOverlayArc(
      g.value,
      scales.circle,
      hoveredCategory.value,
      selectedCategories.value,
      selectedSubCategories.value
    );
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

const handleOutsideClick = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    setHoveredCategory(null);
  }
};

onMounted(() => {
  mountToContainer();
  window.addEventListener('mousemove', updateMousePosition);
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition);
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div class="relative z-10">
    <UiTooltip />
    <div
      id="container"
      ref="container"
      @click.stop
    />
  </div>
</template>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
