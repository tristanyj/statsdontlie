import { arc } from 'd3';
import type { ArcData } from '~/types';

export function useChartGenerators() {
  const arcGenerator = arc<ArcData>()
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);

  return {
    arcGenerator,
  };
}
