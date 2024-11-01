<script setup lang="ts">
import * as d3 from 'd3';
// import type { Player } from '@/types';

const preferencesStore = usePreferencesStore();
const { selectedColumns, selectedColumnsCount } = storeToRefs(preferencesStore);

// const configStore = useConfigStore();
// const { statGroups } = storeToRefs(configStore);

// const props = defineProps<{
//   players: Player[];
// }>();

const container = ref<HTMLElement | null>(null);

const width = 1000;
const height = 1000;
const margin = 100;
const radius = Math.min(width, height) / 2 - margin;
const innerRadiusPadding = 0.1;
const padAngle = 0.0025;

const angleScale = d3
  .scaleLinear()
  .domain([0, selectedColumnsCount.value])
  .range([0, 2 * Math.PI]);

interface ArcData {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const g = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

const arcGenerator = d3
  .arc<ArcData>()
  .padAngle(padAngle)
  .innerRadius((d) => d.innerRadius)
  .outerRadius((d) => d.outerRadius)
  .startAngle((d) => d.startAngle)
  .endAngle((d) => d.endAngle);

function createVisualization() {
  if (!g.value) {
    return;
  }

  g.value
    .selectAll('.background-arc')
    .data(
      selectedColumns.value.map((data, i) => ({
        innerRadius: radius * innerRadiusPadding,
        outerRadius: radius,
        startAngle: angleScale(i),
        endAngle: angleScale(i + 1),
        data,
      }))
    )
    .join('path')
    .attr('class', 'background-arc')
    .attr('d', arcGenerator);
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

function updateVisualization() {
  if (!container.value) return;

  angleScale.domain([0, selectedColumnsCount.value]);

  createVisualization();
}

watch(
  () => selectedColumns.value,
  () => {
    updateVisualization();
  },
  { deep: true }
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
