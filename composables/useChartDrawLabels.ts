import * as d3 from 'd3';

import type { d3GSelection, EnrichedColumn } from '~/types';

export function useChartDrawLabels() {
  const { radius } = useChartDimensions();

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

  function drawColumnLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    columns: EnrichedColumn[]
  ) {
    g.selectAll('.column-label').remove();

    const columnLabels = g
      .selectAll('.column-label')
      .data(columns)
      .enter()
      .append('g')
      .attr('class', 'column-label')
      .attr('transform', (d, i) => `rotate(${angleScale(i)}) translate(0, 10)`);

    columnLabels.each(function (d, i) {
      const midAngle = angleScale(i);

      // Calculate position for group label
      const labelRadius = radius * 1.3; // Place label outside the extended line
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);

      createTextWithBackground(d3.select(this), {
        x,
        y,
        text: d.name,
        textColor: '#fff',
        padding: { x: 0, y: 0 },
      });
    });
  }

  return {
    createTextWithBackground,
    drawColumnLabels,
  };
}
