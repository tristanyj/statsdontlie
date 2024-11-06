<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection, Player } from '@/types';

const { width, height } = useChartDimensions();
const { drawInsideCircle, drawColumnLabelBackgrounds, drawColumnBackgrounds, drawSeparators } =
  useChartDrawArcs();
const { drawColumnLabels, drawColumnScales } = useChartDrawLabels();
const { scales, updateScale } = useChartScales();

const preferencesStore = usePreferencesStore();
const { selectedPlayerIds, selectedColumnIds, selectedColumnIdsCount } =
  storeToRefs(preferencesStore);

const configStore = useConfigStore();
const { statGroups } = storeToRefs(configStore);

const props = defineProps<{
  players: Player[];
}>();

const selectedPlayers = computed(() =>
  props.players.filter((player) => selectedPlayerIds.value.includes(player.id))
);

const statGroupsWithselectedColumnIds = computed(() => {
  return statGroups?.value
    ? statGroups.value
        .map((group) => ({
          ...group,
          subGroups: group.subGroups
            .map((subGroup) => ({
              ...subGroup,
              columns: subGroup.columns.filter((column) =>
                selectedColumnIds.value.includes(column.id)
              ),
            }))
            .filter((subGroup) => subGroup.columns.length > 0),
        }))
        .filter((group) => group.subGroups.length > 0)
    : [];
});

const selectedColumns = computed(() => {
  return statGroupsWithselectedColumnIds.value
    .map((group) => group.subGroups)
    .flat()
    .map((subGroup) => subGroup.columns)
    .flat();
});

updateScale('angle', [0, selectedColumnIdsCount.value]);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);

function createVisualization() {
  if (!g.value) return;
  g.value.selectAll('*').remove();

  drawColumnLabelBackgrounds(g.value, scales.angle, selectedColumns.value);

  // TODO: refactor
  drawColumnBackgrounds(
    g.value,
    scales.angle,
    statGroupsWithselectedColumnIds.value,
    selectedPlayers.value
  );
  drawSeparators(
    g.value,
    scales.angle,
    statGroupsWithselectedColumnIds.value,
    selectedColumnIdsCount.value
  );
  drawInsideCircle(g.value);
  // drawSubCategoryArc(g.value, scales.angle, selectedColumnIds.value);
  drawColumnScales(g.value, scales.angle, selectedColumns.value);

  // Draw Labels
  drawColumnLabels(g.value, scales.angle, selectedColumns.value);
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
  () => selectedColumnIds.value,
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
  () => selectedColumnIdsCount.value,
  (count) => {
    updateScale('angle', [0, count]);
    createVisualization();
  }
);

onMounted(() => {
  mountToContainer();
});
</script>

<template>
  <div
    id="container"
    ref="container"
  />
</template>
