<script setup lang="ts">
import * as d3 from 'd3';
import type { Player } from '@/types';

const configStore = useConfigStore();
const { statGroups } = storeToRefs(configStore);

const props = defineProps<{
  players: Player[];
}>();

const container = ref<HTMLElement | null>(null);

const width = 1000;
const height = 1000;

function createVisualization(g: d3.Selection<SVGGElement, unknown, null, undefined>) {
  // let columnIndex = 0;
  let currentAngle = 0;

  statGroups.value.forEach((group) => {
    // Add group arc/border
    addGroupArc(g, currentAngle, getGroupEndAngle(group));

    // Add group label
    // addGroupLabel(g, group.name, currentAngle, getGroupEndAngle(group));

    // group.subgroups.forEach((subgroup) => {
    //   // Add subgroup arc/border
    //   addSubGroupArc(g, currentAngle, getSubGroupEndAngle(subgroup));

    //   // Add subgroup label
    //   addSubGroupLabel(g, subgroup.name, currentAngle, getSubGroupEndAngle(subgroup));

    //   subgroup.columns.forEach((column) => {
    //     // Create arcs for each QB's stat in this column
    //     props.players.forEach((qb) => {
    //       const statKey = `${group.id}.${subgroup.id}.${column.id}`;
    //       const stat = qb.stats[statKey as keyof typeof qb.stats];

    //       if (stat) {
    //         addStatArc(g, {
    //           value: stat.value,
    //           maxValue: stat.max,
    //           color: qb.color,
    //           columnIndex,
    //           meta: column.meta,
    //         });
    //       }
    //     });

    //     columnIndex++;
    //   });
    // });

    currentAngle = getGroupEndAngle(group);
  });
}

// Helper functions
function getGroupEndAngle(group: Group): number {
  return group.subgroups.reduce((total, subgroup) => total + subgroup.columns.length, 0) * ((2 * Math.PI) / 10);
}

function addGroupArc(g: d3.Selection<SVGGElement, unknown, null, undefined>, startAngle: number, endAngle: number) {
  g.append('path')
    .attr('class', 'group-border')
    .attr(
      'd',
      d3.arc()({
        innerRadius: radius + 20,
        outerRadius: radius + 25,
        startAngle,
        endAngle,
      })
    )
    .attr('fill', '#333');
}

// Similar functions for subgroups and labels

const mountToContainer = () => {
  if (!container.value) {
    return;
  }

  d3.select(container.value).selectAll('*').remove();
  const svg = d3.select(container.value).append('svg').attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`).attr('class', 'mx-auto');
  const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  createVisualization(g);
};

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
