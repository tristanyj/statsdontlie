import type { d3GSelection } from '~/types';

export function useChartDrawCenter() {
  function drawCenter(g: d3GSelection) {
    g.selectAll('.center').remove();

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
