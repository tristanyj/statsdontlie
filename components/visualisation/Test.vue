<template>
  <div
    id="testlol"
    ref="testlol"
    class="relative top-[200px] left-[200px]"
  />
</template>

<script setup>
import * as d3 from 'd3';

onMounted(() => {
  const width = 250;
  const height = 250;
  const numLines = 45;
  const innerRadius = 87;
  const outerRadius = 100;

  const svg = d3.select('#testlol').append('svg').attr('width', width).attr('height', height);

  const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`); // Center the group

  const group = g.append('g').attr('class', 'test-lol-group');

  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * (Math.PI * 2);

    group
      .append('line')
      .attr('x1', Math.cos(angle) * innerRadius)
      .attr('y1', Math.sin(angle) * innerRadius)
      .attr('x2', Math.cos(angle) * outerRadius)
      .attr('y2', Math.sin(angle) * outerRadius)
      .attr('stroke', 'white')
      .attr('stroke-width', 4);
  }

  // Optional: Add the circles for reference
  group
    .append('circle')
    .attr('r', innerRadius)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 4);

  group
    .append('circle')
    .attr('r', outerRadius)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 4);
});
</script>
