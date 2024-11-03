import * as d3 from 'd3';

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
  const { createTextWithBackground } = useChartDrawLabels();

  function drawBackgroundArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedColumnIds: ColumnKey[]
  ) {
    console.log('angle scale:', angleScale.domain());
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
                arcData.push({
                  columnId: column.id,
                  columnIndex,
                  player,
                  stat,
                  scaledValue: column.meta.scale(stat),
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
                innerRadius: radius * innerRadiusPadding,
                outerRadius:
                  radius * innerRadiusPadding + radius * (1 - innerRadiusPadding) * d.scaledValue,
                startAngle: angleScale(d.columnIndex),
                endAngle: angleScale(d.columnIndex + 1),
                data: d,
              })
            )
            .attr('fill', '#123456')
            .attr('opacity', 0)
            .call((enter) => enter.transition().duration(0).attr('opacity', 0.8)),

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
      )
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(0).attr('opacity', 1).attr('stroke-width', 2);

        createTextWithBackground(g!, {
          x: 0,
          y: 0,
          text: `${d.player.id} - ${d.columnId} - ${d.stat}`,
          textColor: '#fff',
          backgroundColor: '#333',
          padding: { x: 8, y: 4 },
          borderRadius: 4,
        });
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(0).attr('opacity', 0.8).attr('stroke-width', 1);

        g!.select('.text-with-background').remove();
      });
  }

  function drawSeparators(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    statGroupsWithselectedColumnIds: Group[],
    selectedColumnIdsCount: number
  ) {
    let columnIndex = 0;
    const groupStartIndices: number[] = [];

    // Collect group start indices
    statGroupsWithselectedColumnIds.forEach((group) => {
      groupStartIndices.push(columnIndex);
      group.subGroups.forEach((subGroup) => {
        columnIndex += subGroup.columns.length;
      });
    });

    // Create all separators
    for (let i = 0; i <= selectedColumnIdsCount; i++) {
      const angle = angleScale(i);
      const isGroupSeparator = groupStartIndices.includes(i);
      const lineLength = isGroupSeparator ? radius * 1.5 : radius; // 20% longer for group separators

      g.append('line')
        .attr('class', `separator ${isGroupSeparator ? 'group-separator' : 'column-separator'}`)
        .attr('x1', 0)
        .attr('y1', radius * innerRadiusPadding)
        .attr('x2', 0)
        .attr('y2', lineLength)
        .attr('stroke', isGroupSeparator ? '#000' : '#000')
        .attr('stroke-width', 1.5)
        .attr('transform', `rotate(${180 + (angle * 180) / Math.PI})`);

      // Add group labels for group separators
      if (isGroupSeparator && i < selectedColumnIdsCount) {
        const groupIndex = groupStartIndices.indexOf(i);
        const group = statGroupsWithselectedColumnIds[groupIndex];
        if (group) {
          const nextGroupStartIndex = groupStartIndices[groupIndex + 1] || selectedColumnIdsCount;
          const midAngle = angleScale((i + nextGroupStartIndex) / 2);

          // Calculate position for group label
          const labelRadius = radius * 1.3; // Place label outside the extended line
          const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
          const y = labelRadius * Math.sin(midAngle - Math.PI / 2);

          const textGroup = g.append('g').attr('class', 'category-label');

          // Add the text first (but don't display it) to calculate its size
          const textElement = textGroup
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#fff')
            .attr('font-size', 24)
            .text(group.name);

          // Get the bounding box of the text
          const bbox = textElement.node()?.getBBox();

          if (bbox) {
            // Add the background rectangle
            textGroup
              .insert('rect', 'text') // Insert before text
              .attr('x', bbox.x - 12)
              .attr('y', bbox.y - 6)
              .attr('width', bbox.width + 12 * 2)
              .attr('height', bbox.height + 6 * 2)
              .attr('rx', 4)
              .attr('ry', 4)
              .attr('fill', '#333')
              .attr('opacity', 0.8);
          }
        }
      }
    }
  }

  return {
    drawBackgroundArcs,
    drawValueArcs,
    drawSeparators,
  };
}
