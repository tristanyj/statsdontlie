import type { d3GSelection, HoveredStatArc } from '~/types';

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
        radius: minRadius * modifier.radius.insideMinStatScale - 20,
        startAngle: (3 * Math.PI) / 2,
        endAngle: (5 * Math.PI) / 2,
        color: '#000',
      },
      {
        id: 'bottom-arc',
        radius: minRadius * modifier.radius.insideMinStatScale - 10,
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI / 2,
        color: '#000',
      },
    ];

    arcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('id', arc.id)
        .attr(
          'd',
          arcGenerator({
            innerRadius: arc.radius,
            outerRadius: arc.radius,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            data: null,
          })
        )
        .attr('stroke', arc.color)
        .attr('opacity', 0.25);
    });

    arcGroup
      .append('text')
      .append('textPath')
      .attr('href', `#${arcs[0].id}`)
      .attr('startOffset', `${20}%`)
      .style('font-size', '12px')
      .text('test hello lol');

    arcGroup
      .append('text')
      .append('textPath')
      .attr('href', `#${arcs[1].id}`)
      .attr('startOffset', `${20}%`)
      .style('font-size', '12px')
      .text('test hello lol');
  }

  return {
    drawCenter,
  };
}
