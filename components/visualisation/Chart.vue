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
    .attr('d', arcGenerator);

  let columnIndex = 0;

  statGroupsWithselectedColumnIds.value.forEach((group, i) => {
    console.log({ group, i });

    // createGroupBorder();
    // createGroupLabel();

    group.subGroups.forEach((subGroup, j) => {
      console.log({ subGroup, j });

      // createSubGroupBorder();
      // createSubGroupLabel();

      subGroup.columns.forEach((column, k) => {
        console.log({ column, k });

        selectedPlayers.value
          .sort((a, b) => {
            const aStat = a.stats[column.id];
            const bStat = b.stats[column.id];

            if (aStat && bStat) {
              return bStat - aStat;
            }

            return 0;
          })
          .forEach((player, l) => {
            console.log({ player, l });

            const stat = player.stats[column.id];

            if (stat && g.value) {
              const scaledValue = column.meta.scale(stat);

              console.log({ scaledValue });

              const arcData = {
                innerRadius: radius * innerRadiusPadding,
                outerRadius:
                  radius * innerRadiusPadding + radius * (1 - innerRadiusPadding) * scaledValue,
                startAngle: angleScale(columnIndex),
                endAngle: angleScale(columnIndex + 1),
                data: {
                  player,
                  stat,
                  column,
                },
              };

              g.value
                .append('path')
                .attr('class', `value-arc player-${player.id}`)
                .attr('d', arcGenerator(arcData))
                .attr('fill', '#fff') // Assuming player has a color property
                .attr('opacity', 0.8)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .on('mouseover', function (event) {
                  // Highlight arc
                  d3.select(this).attr('opacity', 1).attr('stroke-width', 2);

                  // Add tooltip
                  const [x, y] = d3.pointer(event);
                  g.value!.append('text')
                    .attr('class', 'tooltip')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#fff')
                    .text(`${player.name}: ${column.meta.format(stat)}`);
                })
                .on('mouseout', function () {
                  // Reset arc
                  d3.select(this).attr('opacity', 0.8).attr('stroke-width', 1);

                  // Remove tooltip
                  g.value!.selectAll('.tooltip').remove();
                });
            }
          });

        columnIndex++;
      });
    });
  });
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

  angleScale.domain([0, selectedColumnIdsCount.value]);

  createVisualization();
}

watch(
  () => selectedColumnIds.value,
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
