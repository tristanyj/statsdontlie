import { arc } from 'd3';
import type { ArcData } from '~/types';

export function createArcGenerator(padAngle: number) {
  return arc<ArcData>()
    .padAngle(padAngle)
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);
}
