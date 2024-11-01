<script setup lang="ts">
import * as d3 from 'd3';
import type { Player } from '@/types';

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

const container = ref<HTMLElement | null>(null);

const width = 1000;
const height = 1000;
const margin = 100;
const radius = Math.min(width, height) / 2 - margin;
const innerRadiusPadding = 0.1;
const padAngle = 0.0025;

const angleScale = d3
  .scaleLinear()
  .domain([0, selectedColumnIdsCount.value])
  .range([0, 2 * Math.PI]);

interface ArcData {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface ArcDataExtended {
  columnId: string;
  columnIndex: number;
  player: Player;
  stat: number;
  scaledValue: number;
}

const g = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

const arcGenerator = d3
  .arc<ArcData>()
  .padAngle(padAngle)
  .innerRadius((d) => d.innerRadius)
  .outerRadius((d) => d.outerRadius)
  .startAngle((d) => d.startAngle)
  .endAngle((d) => d.endAngle);

function createTextWithBackground(
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  options: {
    x: number;
    y: number;
    text: string;
    textColor?: string;
    backgroundColor?: string;
    padding?: { x: number; y: number };
    borderRadius?: number;
  }
) {
  const {
    x,
    y,
    text,
    textColor = '#fff',
    backgroundColor = '#000',
    padding = { x: 5, y: 3 },
    borderRadius = 3,
  } = options;

  // Create a group for the background and text
  const textGroup = selection.append('g').attr('class', 'text-with-background');

  // Add the text first (but don't display it) to calculate its size
  const textElement = textGroup
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', textColor)
    .attr('font-size', 24)
    .text(text);

  // Get the bounding box of the text
  const bbox = textElement.node()?.getBBox();

  if (bbox) {
    // Add the background rectangle
    textGroup
      .insert('rect', 'text') // Insert before text
      .attr('x', bbox.x - padding.x)
      .attr('y', bbox.y - padding.y)
      .attr('width', bbox.width + padding.x * 2)
      .attr('height', bbox.height + padding.y * 2)
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      .attr('fill', backgroundColor)
      .attr('opacity', 0.8);
  }

  return textGroup;
}

function createVisualization() {
  if (!g.value) return;

  // Clear all existing elements first
  g.value.selectAll('*').remove();

  // Background arcs with proper data binding
  g.value
    .selectAll('.background-arc')
    .data(
      selectedColumnIds.value.map((data, i) => ({
        innerRadius: radius * innerRadiusPadding,
        outerRadius: radius,
        startAngle: angleScale(i),
        endAngle: angleScale(i + 1),
        data,
      }))
    )
    .join('path')
    .attr('class', 'background-arc')
    .attr('d', arcGenerator)
    .attr('fill', '#f0f0f0');

  // Prepare data for all arcs
  const arcData: Array<ArcDataExtended> = [];

  let columnIndex = 0;
  statGroupsWithselectedColumnIds.value.forEach((group) => {
    group.subGroups.forEach((subGroup) => {
      subGroup.columns.forEach((column) => {
        selectedPlayers.value
          .sort((a, b) => {
            const aStat = a.stats[column.id];
            const bStat = b.stats[column.id];
            return (bStat || 0) - (aStat || 0);
          })
          .forEach((player) => {
            const stat = player.stats[column.id];
            if (stat) {
              arcData.push({
                columnId: column.id,
                columnIndex,
                player,
                stat,
                scaledValue: column.meta.scale(stat),
              });
            }
          });
        columnIndex++;
      });
    });
  });

  // Create value arcs with proper data binding
  g.value
    .selectAll('.value-arc')
    .data(arcData, (d) => `${(d as ArcDataExtended).columnId}-${(d as ArcDataExtended).player.id}`) // Key function for proper updates
    .join(
      // Enter
      (enter) =>
        enter
          .append('path')
          .attr('class', (d) => `value-arc player-${d.player.id}`)
          .attr('d', (d) =>
            arcGenerator({
              innerRadius: radius * innerRadiusPadding,
              outerRadius:
                radius * innerRadiusPadding + radius * (1 - innerRadiusPadding) * d.scaledValue,
              startAngle: angleScale(d.columnIndex),
              endAngle: angleScale(d.columnIndex + 1),
              data: d,
            })
          )
          .attr('fill', '#123456')
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(0).attr('opacity', 0.8)),

      // Update
      (update) =>
        update.call((update) =>
          update
            .transition()
            .duration(0)
            .attr('d', (d) =>
              arcGenerator({
                innerRadius: radius * innerRadiusPadding,
                outerRadius:
                  radius * innerRadiusPadding + radius * (1 - innerRadiusPadding) * d.scaledValue,
                startAngle: angleScale(d.columnIndex),
                endAngle: angleScale(d.columnIndex + 1),
                data: d,
              })
            )
        ),

      // Exit
      (exit) => exit.call((exit) => exit.transition().duration(0).attr('opacity', 0).remove())
    )
    .on('mouseover', function (event, d) {
      d3.select(this).transition().duration(0).attr('opacity', 1).attr('stroke-width', 2);

      // Usage in your visualization:
      createTextWithBackground(g.value!, {
        x: 0,
        y: 0,
        text: `${d.player.id} - ${d.columnId} - ${d.stat}`,
        textColor: '#fff',
        backgroundColor: '#333',
        padding: { x: 8, y: 4 },
        borderRadius: 4,
      });
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration(0).attr('opacity', 0.8).attr('stroke-width', 1);

      // Remove the text with background
      g.value!.select('.text-with-background').remove();
    });
}

function updateVisualization() {
  if (!container.value) return;

  angleScale.domain([0, selectedColumnIdsCount.value]);

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
