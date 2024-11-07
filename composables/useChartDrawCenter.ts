import type { d3GSelection, HoveredStatArc } from '~/types';

export function useChartDrawCenter() {
  function drawCenter(g: d3GSelection, hoveredStatArc: HoveredStatArc | null) {
    g.selectAll('.center').remove();

    if (!hoveredStatArc) return;

    g.append('circle')
      .attr('class', 'center')
      .attr('r', 10)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', '#000')
      .attr('opacity', 0.1);
  }

  return {
    drawCenter,
  };
}
