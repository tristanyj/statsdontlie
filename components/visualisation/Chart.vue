<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection, Player } from '@/types';

const { width, height } = useChartDimensions();
const { drawStatLabelArcs, drawStatArcs, drawGroupArcs } = useChartDrawArcs();
const { drawCircularSeparators, drawLinearSeparators } = useChartDrawLines();
const { drawColumnLabels, drawColumnScales, drawGroupLabels } = useChartDrawLabels();
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

const selectedGroups = computed(() => {
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

const selectedSubGroups = computed(() => {
  return selectedGroups.value.flatMap((group) => group.subGroups);
});

const selectedColumns = computed(() => {
  return selectedGroups.value
    .flatMap((group) => group.subGroups)
    .flatMap((subGroup) => subGroup.columns);
});

const indices = computed(() => {
  let currentIndex = 0;
  const groupIndices: number[] = [];
  const subGroupIndices: number[] = [];

  selectedGroups.value.forEach((group) => {
    groupIndices.push(currentIndex);
    group.subGroups.forEach((subGroup) => {
      subGroupIndices.push(currentIndex);
      currentIndex += subGroup.columns.length;
    });
  });

  return {
    group: groupIndices,
    subGroup: subGroupIndices,
  };
});

updateScale('angle', [0, selectedColumnIdsCount.value]);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);

function createVisualization() {
  if (!g.value) return;
  g.value.selectAll('*').remove();

  // -----------------
  // Draw stat arcs and labels
  // -----------------
  drawStatArcs(g.value, scales.angle, selectedGroups.value, selectedPlayers.value);
  drawStatLabelArcs(g.value, scales.angle, selectedColumns.value);

  // -----------------
  // Draw group and sub-group arcs
  // -----------------
  drawGroupArcs(g.value, scales.angle, indices.value.group, selectedGroups.value, 0);
  drawGroupArcs(g.value, scales.angle, indices.value.subGroup, selectedSubGroups.value, 1);

  // -----------------
  // Draw group and sub-group labels
  // -----------------
  drawGroupLabels(g.value, scales.angle, indices.value.group, selectedGroups.value, 0);
  drawGroupLabels(g.value, scales.angle, indices.value.subGroup, selectedSubGroups.value, 1);

  // -----------------
  // TODO: refactor
  // -----------------
  drawColumnScales(g.value, scales.angle, selectedColumns.value);
  drawColumnLabels(g.value, scales.angle, selectedColumns.value);
  drawLinearSeparators(g.value, scales.angle, selectedGroups.value, selectedColumnIdsCount.value);
  drawCircularSeparators(g.value);
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
