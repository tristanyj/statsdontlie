import type { d3GSelection, EnrichedColumn, EnrichedGroup, Group, Player } from '~/types';

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
  const { radius, minRadius, proportions, restRadius } = useChartDimensions();

  function drawColumnLabelBackgrounds(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedColumn: EnrichedColumn[]
  ) {
    const className = 'column-label-background';

    g.selectAll(`.${className}`)
      .data(
        selectedColumn.map((data, i) => ({
          innerRadius: radius * proportions[0],
          outerRadius: radius * proportions[1],
          startAngle: angleScale(i),
          endAngle: angleScale(i + 1),
          data,
        }))
      )
      .join('path')
      .attr('class', className)
      .attr('d', arcGenerator)
      .attr('fill', (d) => d.data.color ?? '#f0f0f0');
  }

  function drawInsideCircle(g: d3GSelection) {
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

    // circle max radius for column labels
    g.append('circle')
      .attr('r', radius * proportions[1])
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circle max radius for sub groups
    g.append('circle')
      .attr('r', radius * proportions[2])
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circle max radius for groups
    g.append('circle')
      .attr('r', radius * proportions[3])
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // circles graduations for stats
    for (let i = 0; i < 10; i++) {
      g.append('circle')
        .attr('r', minRadius + restRadius * ((1 / 10) * i))
        .attr('fill', 'none')
        .attr('stroke', '#111')
        .attr('stroke-opacity', 0.1)
        .attr('stroke-width', 1);
    }
  }

  function drawColumnBackgrounds(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithselectedColumnIds: EnrichedGroup[],
    selectedPlayers: Player[]
  ) {
    const className = 'column-background';
    const arcData: Array<ArcDataExtended> = [];

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

    g.selectAll(`.${className}`)
      .data(
        arcData,
        (d) => `${(d as ArcDataExtended).columnId}-${(d as ArcDataExtended).player.id}`
      )
      .join((enter) =>
        enter
          .append('path')
          .attr('class', (d) => `${className} player-${d.player.id}`)
          .attr('d', (d) =>
            arcGenerator({
              innerRadius: minRadius,
              outerRadius: minRadius + restRadius * d.scaledValue,
              startAngle: angleScale(d.columnIndex),
              endAngle: angleScale(d.columnIndex + 1),
              data: d,
            })
          )
          .attr('fill', (d) => d.player.colors[0])
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(0).attr('opacity', 1))
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
        ? radius * proportions[3]
        : isSubGroupSeparator
        ? radius * proportions[2]
        : radius * proportions[1];

      g.append('line')
        .attr('class', `separator ${isGroupSeparator ? 'group-separator' : 'column-separator'}`)
        .attr('x1', 0)
        .attr('y1', minRadius)
        .attr('x2', 0)
        .attr('y2', lineLength)
        .attr('stroke', isGroupSeparator ? '#000' : '#000')
        .attr('stroke-width', 1)
        .attr('transform', `rotate(${180 + (angle * 180) / Math.PI})`);

      // add line at center of each column, calculate center point of each column
      if (!isGroupSeparator && !isSubGroupSeparator && i < selectedColumnIdsCount) {
        const nextAngle = angleScale(i + 1);
        const midAngle = (angle + nextAngle) / 2;

        g.append('line')
          .attr('class', 'column-center-separator')
          .attr('x1', 0)
          .attr('y1', minRadius)
          .attr('x2', 0)
          .attr('y2', radius * proportions[0])
          .attr('stroke', '#000')
          .attr('stroke-opacity', 0.1)
          .attr('stroke-width', 1)
          .attr('transform', `rotate(${180 + (midAngle * 180) / Math.PI})`);
      }

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
          const labelRadius = radius * proportions[2] + offset;

          const backgroundArc = arcGenerator({
            innerRadius: radius * proportions[2],
            outerRadius: radius * proportions[3],
            startAngle,
            endAngle,
            data: group,
          });

          g.append('path')
            .attr('d', backgroundArc)
            .attr('fill', group.color ?? '#f0f0f0');

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
          const labelRadius = radius * proportions[1] + offset;

          const backgroundArc = arcGenerator({
            innerRadius: radius * proportions[1],
            outerRadius: radius * proportions[2],
            startAngle,
            endAngle,
            data: subGroup,
          });

          g.append('path')
            .attr('d', backgroundArc)
            .attr('fill', subGroup.color ?? '#f0f0f0');

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
    drawInsideCircle,
    drawColumnLabelBackgrounds,
    drawColumnBackgrounds,
    drawSeparators,
  };
}
