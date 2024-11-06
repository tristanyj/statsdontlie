import type { d3GSelection, Group } from '~/types';

export function useChartDrawLines() {
  const { createLine } = useChartGenerators();
  const { radius, minRadius, restRadius, proportions } = useChartConfig();

  function drawCircularSeparators(g: d3GSelection) {
    // circle inside min radius
    g.append('circle')
      .attr('r', minRadius * 0.9)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circle min radius
    g.append('circle')
      .attr('r', minRadius)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circle max radius for stats
    g.append('circle')
      .attr('r', radius * proportions[0])
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circle outside max scale
    g.append('circle')
      .attr('r', radius * proportions[0] * 1.035)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .attr('stroke-width', 1);

    for (let i = 0; i < 3; i++) {
      // circles for radius proportions
      g.append('circle')
        .attr('r', radius * proportions[i + 1])
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', 1);
    }

    for (let i = 0; i < 10; i++) {
      // circles graduations for stats
      g.append('circle')
        .attr('r', minRadius + restRadius * ((1 / 10) * i))
        .attr('fill', 'none')
        .attr('stroke', '#111')
        .attr('stroke-opacity', 0.1)
        .attr('stroke-width', 1);
    }
  }

  const drawLinearSeparators = (
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithSelectedStatIds: Group[],
    selectedStatIdsCount: number
  ) => {
    let columnIndex = 0;
    const groupStartIndices: number[] = [];
    const subGroupStartIndices: number[] = [];

    statGroupsWithSelectedStatIds.forEach((group) => {
      groupStartIndices.push(columnIndex);
      group.subGroups.forEach((subGroup) => {
        subGroupStartIndices.push(columnIndex);
        columnIndex += subGroup.stats.length;
      });
    });

    // Create all separators
    for (let i = 0; i <= selectedStatIdsCount; i++) {
      const startAngle = angleScale(i);
      const isGroupSeparator = groupStartIndices.includes(i);
      const isSubGroupSeparator = subGroupStartIndices.includes(i);

      const lineLength = isGroupSeparator
        ? radius * proportions[3]
        : isSubGroupSeparator
        ? radius * proportions[2]
        : radius * proportions[1];

      createLine(g, {
        className: `separator ${isGroupSeparator ? 'group-separator' : 'column-separator'}`,
        y1: minRadius,
        y2: lineLength,
        transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
      });

      if (i < selectedStatIdsCount) {
        const nextAngle = angleScale(i + 1);
        const midAngle = (startAngle + nextAngle) / 2;

        // add line at center of each column, calculate center point of each column
        createLine(g, {
          className: 'column-center-separator',
          y1: minRadius,
          y2: radius * proportions[0],
          opacity: 0.1,
          transform: `rotate(${180 + (midAngle * 180) / Math.PI})`,
        });
      }
    }
  };

  return {
    drawCircularSeparators,
    drawLinearSeparators,
  };
}
