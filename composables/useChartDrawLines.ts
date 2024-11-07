import type { d3GSelection, LineData } from '~/types';

const createLine = (g: d3GSelection, params: LineData) => {
  g.append('line')
    .attr('class', params.className)
    .attr('x1', 0)
    .attr('y1', params.y1)
    .attr('x2', 0)
    .attr('y2', params.y2)
    .attr('stroke', params.stroke ?? '#000')
    .attr('opacity', params.opacity ?? 1)
    .attr('stroke-width', params.strokeWidth ?? 1)
    .attr('transform', params.transform);
};

export function useChartDrawLines() {
  const { radius, minRadius, restRadius, proportions, layerCount, modifier, legend } =
    useChartConfig();

  function drawCircularSeparators(g: d3GSelection) {
    // circle inside min radius
    g.append('circle')
      .attr('r', minRadius * modifier.radius.insideMinStatScale)
      .attr('fill', 'none')
      .attr('stroke', modifier.color.separator.stroke)
      .attr('stroke-opacity', modifier.color.separator.highOpacity);

    // circle min radius
    g.append('circle')
      .attr('r', minRadius)
      .attr('fill', 'none')
      .attr('stroke', modifier.color.separator.stroke)
      .attr('stroke-opacity', modifier.color.separator.highOpacity);

    // circle max radius for stats
    g.append('circle')
      .attr('r', radius * proportions[0])
      .attr('fill', 'none')
      .attr('stroke', modifier.color.separator.stroke)
      .attr('stroke-opacity', modifier.color.separator.highOpacity);

    // circle outside max scale
    g.append('circle')
      .attr('r', radius * proportions[0] * modifier.radius.outsideMaxStatScale)
      .attr('fill', 'none')
      .attr('stroke', modifier.color.separator.stroke)
      .attr('stroke-opacity', modifier.color.separator.lowOpacity);

    for (let i = 0; i < 2; i++) {
      // layers - stats, subgroups, groups
      g.append('circle')
        .attr('r', radius * proportions[i + 1])
        .attr('fill', 'none')
        .attr('stroke', modifier.color.separator.stroke)
        .attr('stroke-opacity', modifier.color.separator.highOpacity);
    }

    for (let i = 0; i < layerCount; i++) {
      // ticks for stats
      g.append('circle')
        .attr('r', minRadius + restRadius * (i / layerCount))
        .attr('fill', 'none')
        .attr('stroke', modifier.color.separator.stroke)
        .attr('stroke-opacity', modifier.color.separator.lowOpacity);
    }
  }

  function drawLinearSeparators(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    groupIndices: number[],
    subGroupIndices: number[],
    selectedStatIdsCount: number
  ) {
    for (let i = 0; i <= selectedStatIdsCount; i++) {
      const startAngle = circleScale(i);
      const isGroupSeparator = groupIndices.includes(i);
      const isSubGroupSeparator = subGroupIndices.includes(i);

      const isLastStat = i === selectedStatIdsCount;

      const className = `separator ${
        isGroupSeparator
          ? 'group-separator'
          : isSubGroupSeparator
          ? 'sub-group-separator'
          : 'stat-separator'
      }`;

      const lineLength =
        isGroupSeparator || isLastStat
          ? radius * proportions[3]
          : isSubGroupSeparator
          ? radius * proportions[2]
          : radius * proportions[1];

      createLine(g, {
        className,
        y1: minRadius,
        y2: lineLength,
        strokeWidth: isGroupSeparator || isLastStat ? 1.5 : 1,
        opacity: modifier.color.separator.highOpacity,
        transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
      });

      const nextAngle = circleScale(isLastStat ? i + legend.columnCount : i + 1);
      const midAngle = (startAngle + nextAngle) / 2;

      createLine(g, {
        className: 'stat-center-separator',
        y1: minRadius,
        y2: radius * proportions[0],
        opacity: modifier.color.separator.lowOpacity,
        transform: `rotate(${180 + (midAngle * 180) / Math.PI})`,
      });
    }
  }

  return {
    drawCircularSeparators,
    drawLinearSeparators,
  };
}
