import { arc } from 'd3';
import type { ArcData, d3GSelection, LineData } from '~/types';

export function useChartGenerators() {
  const { padAngle } = useChartDimensions();

  const arcGenerator = arc<ArcData>()
    .padAngle(padAngle)
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);

  const createLine = (g: d3GSelection, params: LineData) => {
    g.append('line')
      .attr('class', params.className)
      .attr('x1', 0)
      .attr('y1', params.y1)
      .attr('x2', 0)
      .attr('y2', params.y2)
      .attr('stroke', params.stroke ?? '#000')
      .attr('opacity', params.opacity ?? 1)
      .attr('stroke-width', 1)
      .attr('transform', params.transform);
  };

  return {
    arcGenerator,
    createLine,
  };
}
