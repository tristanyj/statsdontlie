import type { d3GSelection } from '~/types';

export function useChartDrawLines() {
  const { createLine } = useChartGenerators();
  const { radius, minRadius, restRadius, proportions, modifier } = useChartConfig();

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

    for (let i = 0; i < 3; i++) {
      // layers - stats, subgroups, groups
      g.append('circle')
        .attr('r', radius * proportions[i + 1])
        .attr('fill', 'none')
        .attr('stroke', modifier.color.separator.stroke)
        .attr('stroke-opacity', modifier.color.separator.highOpacity);
    }

    for (let i = 0; i < 10; i++) {
      // ticks for stats
      g.append('circle')
        .attr('r', minRadius + restRadius * ((1 / 10) * i))
        .attr('fill', 'none')
        .attr('stroke', modifier.color.separator.stroke)
        .attr('stroke-opacity', modifier.color.separator.lowOpacity);
    }
  }

  function drawLinearSeparators(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    groupIndices: number[],
    subGroupIndices: number[],
    selectedStatIdsCount: number
  ) {
    for (let i = 0; i <= selectedStatIdsCount; i++) {
      const startAngle = angleScale(i);
      const isGroupSeparator = groupIndices.includes(i);
      const isSubGroupSeparator = subGroupIndices.includes(i);

      const className = `separator ${
        isGroupSeparator
          ? 'group-separator'
          : isSubGroupSeparator
          ? 'sub-group-separator'
          : 'stat-separator'
      }`;

      const lineLength = isGroupSeparator
        ? radius * proportions[3]
        : isSubGroupSeparator
        ? radius * proportions[2]
        : radius * proportions[1];

      createLine(g, {
        className,
        y1: minRadius,
        y2: lineLength,
        opacity: modifier.color.separator.highOpacity,
        transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
      });

      if (i < selectedStatIdsCount) {
        const nextAngle = angleScale(i + 1);
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
  }

  return {
    drawCircularSeparators,
    drawLinearSeparators,
  };
}
