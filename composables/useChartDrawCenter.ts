import type { d3GSelection } from '~/types';
import { calcTextLength } from '~/assets/scripts/utils';

export function useChartDrawCenter() {
  const { arcGenerator } = useChartGenerators();
  const { minRadius, modifier } = useChartConfig();

  function drawCenter(g: d3GSelection) {
    g.selectAll('.center').remove();

    const fontSize = 11;
    const arcGroup = g.append('g').attr('class', 'center');

    const clickableArcs = [
      {
        id: 'top-clickable',
        startAngle: -Math.PI / 2, // Start at top (-90 degrees)
        endAngle: Math.PI / 2, // End at bottom (90 degrees)
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#123456',
        onClick: () => console.log('Select players'),
      },
      {
        id: 'bottom-clickable',
        startAngle: Math.PI / 2, // Start at bottom (90 degrees)
        endAngle: (3 * Math.PI) / 2, // End at top (270 degrees)
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#272532',
        onClick: () => console.log('Select stats'),
      },
    ];

    clickableArcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('class', `clickable-arc ${arc.id}`)
        .attr(
          'd',
          arcGenerator({
            innerRadius: 0,
            outerRadius: arc.radius,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            data: null,
          })
        )
        .attr('fill', arc.background)
        .style('cursor', 'pointer')
        .on('click', arc.onClick);
    });

    const arcs = [
      {
        id: 'top-arc',
        text: 'Click here to select players',
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.top,
        startAngle: (3 * Math.PI) / 2,
        endAngle: (5 * Math.PI) / 2,
        color: modifier.color.black,
      },
      {
        id: 'bottom-arc',
        text: `Click here to select stats`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.bottom,
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI / 2,
        color: modifier.color.black,
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
        .style('fill', '#fff')
        .text(arc.text);
    });

    // arcGroup
    //   .append('text')
    //   .attr('x', 0)
    //   .attr('y', 0 + modifier.space.donut.center.top)
    //   .attr('text-anchor', 'middle')
    //   .attr('dominant-baseline', 'middle')
    //   .attr('fill', modifier.color.black)
    //   .attr('font-size', fontSize + 5)
    //   .text(statValue);
  }

  return {
    drawCenter,
  };
}
