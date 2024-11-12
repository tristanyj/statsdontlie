import type { d3GSelection } from '~/types';
import { calcTextLength } from '~/assets/scripts/utils';

import * as d3 from 'd3';

export function useChartDrawCenter() {
  const { openPicker } = useInteractionStore();

  const { arcGenerator } = useChartGenerators();
  const { minRadius, modifier } = useChartConfig();

  function drawCenter(g: d3GSelection) {
    g.selectAll('.center').remove();

    const fontSize = 12;
    const arcGroup = g.append('g').attr('class', 'center');

    const textArcs = [
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

    const clickableArcs = [
      {
        id: 'top-clickable',
        startAngle: -Math.PI / 2, // Start at top (-90 degrees)
        endAngle: Math.PI / 2, // End at bottom (90 degrees)
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#123456',
        onClick: () => openPicker('players'),
      },
      {
        id: 'bottom-clickable',
        startAngle: Math.PI / 2, // Start at bottom (90 degrees)
        endAngle: (3 * Math.PI) / 2, // End at top (270 degrees)
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#272532',
        onClick: () => openPicker('stats'),
      },
    ];

    clickableArcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('class', `${arc.id}-normal`)
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

    textArcs.forEach((arc) => {
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

    clickableArcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('class', `${arc.id}-hover`)
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
        .on('click', arc.onClick)
        .on('mouseover', () => {
          const halfCircle = d3.select(`.${arc.id}-normal`);
          halfCircle.classed('hover', true);
        })
        .on('mouseout', () => {
          const halfCircle = d3.select(`.${arc.id}-normal`);
          halfCircle.classed('hover', false);
        });
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
