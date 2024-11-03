<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection, Player } from '@/types';

const { width, height } = useChartDimensions();
const { drawBackgroundArcs, drawValueArcs, drawSeparators } = useChartDrawArcs();
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
  if (!statGroups?.value) {
    return [];
  }

  const groups = [];

  for (const group of statGroups.value) {
    const subGroups = [];

    for (const subGroup of group.subGroups) {
      const columns = subGroup.columns.filter((column) =>
        selectedColumnIds.value.includes(column.id)
      );
      if (columns.length > 0) {
        subGroups.push({
          ...subGroup,
          columns,
        });
      }
    }

    if (subGroups.length > 0) {
      groups.push({
        ...group,
        subGroups,
      });
    }
  }

  return groups;
});

updateScale('angle', [0, selectedColumnIdsCount.value]);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);

function createVisualization() {
  if (!g.value) return;
  g.value.selectAll('*').remove();

  drawBackgroundArcs(g.value, scales.angle, selectedColumnIds.value);
  drawValueArcs(
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
