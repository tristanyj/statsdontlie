import type { d3GSelection, EnrichedColumn, EnrichedGroup, Group, Player, SubGroup } from '~/types';

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

  function drawColumnBackgrounds(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithSelectedColumnIds: EnrichedGroup[],
    selectedPlayers: Player[]
  ) {
    const className = 'column-background';
    const arcData: Array<ArcDataExtended> = [];

    let columnIndex = 0;
    statGroupsWithSelectedColumnIds.forEach((group) => {
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
    statGroupsWithSelectedColumnIds: Group[],
    selectedColumnIdsCount: number
  ) {
    const drawArc = (
      indices: number[],
      index: number,
      groupIndex: number,
      group: Group | SubGroup,
      modifier: number
    ) => {
      if (!group) return;

      const nextGroupStartIndex = indices[groupIndex + 1] ?? selectedColumnIdsCount;

      const startAngle = angleScale(index);
      const endAngle = angleScale(nextGroupStartIndex);

      const midAngle = (startAngle + endAngle) / 2;
      const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
      const offset = shouldFlip ? 21 : 13;
      const labelRadius = radius * proportions[2 - modifier] + offset;

      const backgroundArc = arcGenerator({
        innerRadius: radius * proportions[2 - modifier],
        outerRadius: radius * proportions[3 - modifier],
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

      g.append('path').attr('id', `label-path-${group.id}`).attr('d', textArc);

      g.append('text')
        .append('textPath')
        .attr('href', `#label-path-${group.id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', '12px')
        .text(group.name);
    };

    let columnIndex = 0;
    const groupStartIndices: number[] = [];
    const subGroupStartIndices: number[] = [];

    statGroupsWithSelectedColumnIds.forEach((group) => {
      groupStartIndices.push(columnIndex);
      group.subGroups.forEach((subGroup) => {
        subGroupStartIndices.push(columnIndex);
        columnIndex += subGroup.columns.length;
      });
    });

    const subGroups = statGroupsWithSelectedColumnIds.flatMap((group) => group.subGroups);

    for (let i = 0; i <= selectedColumnIdsCount; i++) {
      if (groupStartIndices.includes(i)) {
        const groupIndex = groupStartIndices.indexOf(i);
        drawArc(groupStartIndices, i, groupIndex, statGroupsWithSelectedColumnIds[groupIndex], 0);
      }

      if (subGroupStartIndices.includes(i)) {
        const groupIndex = subGroupStartIndices.indexOf(i);
        drawArc(subGroupStartIndices, i, groupIndex, subGroups[groupIndex], 1);
      }
    }
  }

  return {
    drawColumnLabelBackgrounds,
    drawColumnBackgrounds,
    drawSeparators,
  };
}
