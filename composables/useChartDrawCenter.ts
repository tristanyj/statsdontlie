import type { d3GSelection, Player } from '~/types';

import { calcTextLength } from '~/assets/scripts/utils';

export function useChartDrawCenter() {
  const { arcGenerator } = useChartGenerators();
  const { minRadius, modifier } = useChartConfig();

  function drawCenter(g: d3GSelection, hoveredPlayer: Player | null) {
    g.selectAll('.center').remove();

    if (!hoveredPlayer) return;

    const fontSize = 11;
    const arcGroup = g.append('g').attr('class', 'center');

    const arcs = [
      {
        id: 'top-arc',
        text: `${hoveredPlayer.name}`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.top,
        startAngle: (3 * Math.PI) / 2,
        endAngle: (5 * Math.PI) / 2,
        color: '#000',
      },
      {
        id: 'bottom-arc',
        text: `#1 overall`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.bottom,
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI / 2,
        color: '#000',
      },
    ];

    arcs.forEach((arc) => {
      const textArc = arcGenerator({
        innerRadius: arc.radius,
        outerRadius: arc.radius,
        startAngle: arc.startAngle,
        endAngle: arc.endAngle,
        data: null,
      });

      const textLength = calcTextLength(g, arc.id, arc.text, fontSize);

      const arcLength = Math.abs(arc.endAngle - arc.startAngle) * arc.radius;
      const textPercentage = (textLength / arcLength) * 100;
      const textOffsetPercentage = (100 - textPercentage) / 4;

      arcGroup.append('path').attr('id', arc.id).attr('d', textArc);

      arcGroup
        .append('text')
        .append('textPath')
        .attr('href', `#${arc.id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', fontSize)
        .text(arc.text);
    });

    const statValue = 12;

    arcGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 0 + modifier.space.donut.center.top)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#000')
      .attr('font-size', fontSize + 5)
      .text(statValue);

    arcGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 0 + modifier.space.donut.center.bottom)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#000')
      .attr('font-size', fontSize)
      .text(hoveredPlayer.name);
  }

  return {
    drawCenter,
  };
}
