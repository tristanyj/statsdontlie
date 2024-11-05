import type { ColumnKey, d3GSelection, EnrichedGroup, Group, Player } from '~/types';

export interface ArcData {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface ArcDataExtended {
  columnId: string;
  columnIndex: number;
  player: Player;
  stat: number;
  scaledValue: number;
}

export function useChartDrawArcs() {
  const { arcGenerator } = useChartGenerators();
  const { radius, innerRadiusPadding } = useChartDimensions();

  function drawOutsideArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedColumnIds: ColumnKey[]
  ) {
    g.selectAll('.outside-arc')
      .data(
        selectedColumnIds.map((data, i) => ({
          innerRadius: radius,
          outerRadius: radius * 1.5,
          startAngle: angleScale(i),
          endAngle: angleScale(i + 1),
          data,
        }))
      )
      .join('path')
      .attr('class', 'outside-arc')
      .attr('d', arcGenerator)
      .attr('fill', '#f0f0f0');
  }

  function drawInsideCircle(g: d3GSelection) {
    g.append('circle')
      .attr('r', radius * innerRadiusPadding * 0.9)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    g.append('circle')
      .attr('r', radius * innerRadiusPadding)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    g.append('circle')
      .attr('r', radius * 1.5)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    g.append('circle')
      .attr('r', radius * 1.6)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    g.append('circle')
      .attr('r', radius * 1.7)
      .attr('fill', 'none') // Use 'none' instead of '#fff'
      .attr('stroke', '#000')
      .attr('stroke-width', 1);
  }

  // function drawSubCategoryArc(
  //   g: d3GSelection,
  //   angleScale: d3.ScaleLinear<number, number>,
  //   selectedColumnIds: ColumnKey[]
  // ) {
  //   g.select('.category-arc')
  //     .data({
  //       innerRadius: radius * 1.5 * innerRadiusPadding,
  //       outerRadius: radius * 1.5,
  //       startAngle: angleScale(0),
  //       endAngle: angleScale(360),
  //     })
  //     .join('path')
  //     .attr('class', 'category-arc')
  //     .attr('d', arcGenerator)
  //     .attr('fill', '#111');
  // }

  function drawBackgroundArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedColumnIds: ColumnKey[]
  ) {
    // console.log('angle scale:', angleScale.domain());
    g.selectAll('.background-arc')
      .data(
        selectedColumnIds.map((data, i) => ({
          innerRadius: radius * innerRadiusPadding,
          outerRadius: radius,
          startAngle: angleScale(i),
          endAngle: angleScale(i + 1),
          data,
        }))
      )
      .join('path')
      .attr('class', 'background-arc')
      .attr('d', arcGenerator)
      .attr('fill', '#f0f0f0');
  }

  function drawValueArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithselectedColumnIds: EnrichedGroup[],
    selectedPlayers: Player[]
  ) {
    const arcData: Array<ArcDataExtended> = [];

    const baseRadius = radius * innerRadiusPadding;
    const fullRadius = radius * (1 - innerRadiusPadding);

    let columnIndex = 0;
    statGroupsWithselectedColumnIds.forEach((group) => {
      group.subGroups.forEach((subGroup) => {
        subGroup.columns.forEach((column) => {
          selectedPlayers
            .sort((a, b) => {
              const aStat = a.stats[column.id];
              const bStat = b.stats[column.id];
              return (bStat || 0) - (aStat || 0);
            })
            .forEach((player) => {
              const stat = player.stats[column.id];
              if (stat) {
                const v = column.meta.scale(stat);

                // console.log({ v, stat, column });
                arcData.push({
                  columnId: column.id,
                  columnIndex,
                  player,
                  stat,
                  scaledValue: v,
                });
              }
            });
          columnIndex++;
        });
      });
    });

    g.selectAll('.value-arc')
      .data(
        arcData,
        (d) => `${(d as ArcDataExtended).columnId}-${(d as ArcDataExtended).player.id}`
      )
      .join(
        // Enter
        (enter) =>
          enter
            .append('path')
            .attr('class', (d) => `value-arc player-${d.player.id}`)
            .attr('d', (d) =>
              arcGenerator({
                innerRadius: baseRadius,
                outerRadius: baseRadius + fullRadius * d.scaledValue,
                startAngle: angleScale(d.columnIndex),
                endAngle: angleScale(d.columnIndex + 1),
                data: d,
              })
            )
            .attr('fill', (d) => d.player.colors[0])
            .attr('opacity', 0)
            .call((enter) => enter.transition().duration(0).attr('opacity', 1)),

        // Update
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(0)
              .attr('d', (d) =>
                arcGenerator({
                  innerRadius: radius * innerRadiusPadding,
                  outerRadius:
                    radius * innerRadiusPadding + radius * (1 - innerRadiusPadding) * d.scaledValue,
                  startAngle: angleScale(d.columnIndex),
                  endAngle: angleScale(d.columnIndex + 1),
                  data: d,
                })
              )
          ),

        // Exit
        (exit) => exit.call((exit) => exit.transition().duration(0).attr('opacity', 0).remove())
      );
  }

  function drawSeparators(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithselectedColumnIds: Group[],
    selectedColumnIdsCount: number
  ) {
    let columnIndex = 0;
    const groupStartIndices: number[] = [];
    const subGroupStartIndices: number[] = [];

    // Collect group start indices
    statGroupsWithselectedColumnIds.forEach((group) => {
      groupStartIndices.push(columnIndex);
      group.subGroups.forEach((subGroup) => {
        subGroupStartIndices.push(columnIndex);
        columnIndex += subGroup.columns.length;
      });
    });

    const subGroups = statGroupsWithselectedColumnIds.flatMap((group) => group.subGroups);

    // Create all separators
    for (let i = 0; i <= selectedColumnIdsCount; i++) {
      const angle = angleScale(i);
      const isGroupSeparator = groupStartIndices.includes(i);
      const isSubGroupSeparator = subGroupStartIndices.includes(i);

      const lineLength = isGroupSeparator
        ? radius * 1.7
        : isSubGroupSeparator
        ? radius * 1.6
        : radius * 1.5;

      g.append('line')
        .attr('class', `separator ${isGroupSeparator ? 'group-separator' : 'column-separator'}`)
        .attr('x1', 0)
        .attr('y1', radius * innerRadiusPadding)
        .attr('x2', 0)
        .attr('y2', lineLength)
        .attr('stroke', isGroupSeparator ? '#000' : '#000')
        .attr('stroke-width', 1)
        .attr('transform', `rotate(${180 + (angle * 180) / Math.PI})`);

      // Add group labels for group separators
      if (isGroupSeparator && i < selectedColumnIdsCount) {
        const groupIndex = groupStartIndices.indexOf(i);
        const group = statGroupsWithselectedColumnIds[groupIndex];

        if (group) {
          const nextGroupStartIndex = groupStartIndices[groupIndex + 1] || selectedColumnIdsCount;
          const startAngle = angleScale(i);
          const endAngle = angleScale(nextGroupStartIndex);
          const midAngle = (startAngle + endAngle) / 2;
          const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
          const offset = shouldFlip ? 21 : 13;
          const labelRadius = radius * 1.6 + offset;

          const textArc = arcGenerator({
            innerRadius: labelRadius,
            outerRadius: labelRadius,
            startAngle: shouldFlip ? endAngle : startAngle,
            endAngle: shouldFlip ? startAngle : endAngle,
            data: group,
          });

          const tempText = g
            .append('text')
            .style('font-size', '12px')
            .text(group.name)
            .style('visibility', 'hidden');
          const textLength = tempText.node()?.getComputedTextLength() || 0;
          tempText.remove();

          const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
          const textPercentage = (textLength / arcLength) * 100;
          const restPercentage = 100 - textPercentage;
          const textOffsetPercentage = restPercentage / 4;

          // console.log({ textLength, arcLength, textOffsetPercentage });

          // console.log(`Group ${group.name}:`, {
          //   startAngle: (startAngle * 180) / Math.PI,
          //   endAngle: (endAngle * 180) / Math.PI,
          //   startIndex: i,
          //   endIndex: nextGroupStartIndex,
          // });

          g.append('path').attr('id', `label-path-${group.id}`).attr('d', textArc);
          // .attr('stroke', getRandomColor());

          g.append('text')
            .append('textPath')
            .attr('href', `#label-path-${group.id}`)
            .attr('startOffset', `${textOffsetPercentage}%`)
            .style('font-size', '12px')
            .text(group.name);
        }
      }

      if (isSubGroupSeparator && i < selectedColumnIdsCount) {
        const subGroupIndex = subGroupStartIndices.indexOf(i);
        const subGroup = subGroups[subGroupIndex];

        if (subGroup) {
          const nextSubGroupStartIndex =
            subGroupStartIndices[subGroupIndex + 1] || selectedColumnIdsCount;
          const startAngle = angleScale(i);
          const endAngle = angleScale(nextSubGroupStartIndex);
          const midAngle = (startAngle + endAngle) / 2;
          const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
          const offset = shouldFlip ? 21 : 13;
          const labelRadius = radius * 1.5 + offset;

          const textArc = arcGenerator({
            innerRadius: labelRadius,
            outerRadius: labelRadius,
            startAngle: shouldFlip ? endAngle : startAngle,
            endAngle: shouldFlip ? startAngle : endAngle,
            data: subGroup,
          });

          const tempText = g
            .append('text')
            .style('font-size', '12px')
            .text(subGroup.name)
            .style('visibility', 'hidden');
          const textLength = tempText.node()?.getComputedTextLength() || 0;
          tempText.remove();

          const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
          const textPercentage = (textLength / arcLength) * 100;
          const restPercentage = 100 - textPercentage;
          const textOffsetPercentage = restPercentage / 4;

          // console.log({ textLength, arcLength, textOffsetPercentage });

          // console.log(`subGroup ${subGroup.name}:`, {
          //   startAngle: (startAngle * 180) / Math.PI,
          //   endAngle: (endAngle * 180) / Math.PI,
          //   startIndex: i,
          //   endIndex: nextSubGroupStartIndex,
          // });

          g.append('path').attr('id', `label-path-${subGroup.id}`).attr('d', textArc);
          // .attr('stroke', getRandomColor());

          g.append('text')
            .append('textPath')
            .attr('href', `#label-path-${subGroup.id}`)
            .attr('startOffset', `${textOffsetPercentage}%`)
            .style('font-size', '12px')
            .text(subGroup.name);
        }
      }
    }
  }

  return {
    // drawSubCategoryArc,
    drawInsideCircle,
    drawOutsideArcs,
    drawBackgroundArcs,
    drawValueArcs,
    drawSeparators,
  };
}
