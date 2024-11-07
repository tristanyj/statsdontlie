import type { d3GSelection, HoveredStatArc } from '~/types';

import { calcTextLength } from '~/assets/scripts/utils';

export function useChartDrawCenter() {
  const { arcGenerator } = useChartGenerators();
  const { minRadius, modifier } = useChartConfig();

  function drawCenter(g: d3GSelection, hoveredStatArc: HoveredStatArc | null) {
    g.selectAll('.center').remove();

    if (!hoveredStatArc) return;

    const arcGroup = g.append('g').attr('class', 'center');

    const arcs = [
      {
        id: 'top-arc',
        text: `${hoveredStatArc.player.name}`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.center.arc.top,
        startAngle: (3 * Math.PI) / 2,
        endAngle: (5 * Math.PI) / 2,
        color: '#000',
      },
      {
        id: 'bottom-arc',
        text: `${hoveredStatArc.stat.name}`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.center.arc.bottom,
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

      const fontSize = 11;
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
  }

  return {
    drawCenter,
  };
}
