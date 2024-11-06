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

  function drawStatArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedGroups: EnrichedGroup[],
    selectedPlayers: Player[]
  ) {
    const className = 'column-background';

    const arcData: Array<ArcDataExtended> = [];

    // TODO: refactor this to use a single loop
    let columnIndex = 0;
    selectedGroups.forEach((group) => {
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

  function drawStatLabelArcs(
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

  function drawGroupArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    groups: Group[] | SubGroup[],
    modifier: number
  ) {
    indices.forEach((startIndex, groupIndex) => {
      const group = groups[groupIndex];
      const nextGroupStartIndex =
        indices[groupIndex + 1] ??
        startIndex +
          ('subGroups' in group
            ? (group as Group).subGroups.reduce((sum, sg) => sum + sg.columns.length, 0)
            : group.columns.length);

      const startAngle = angleScale(startIndex);
      const endAngle = angleScale(nextGroupStartIndex);

      const backgroundArc = arcGenerator({
        innerRadius: radius * proportions[3 - modifier],
        outerRadius: radius * proportions[2 - modifier],
        startAngle,
        endAngle,
        data: group,
      });

      g.append('path')
        .attr('d', backgroundArc)
        .attr('fill', group.color ?? '#f0f0f0');
    });
  }

  return {
    drawStatLabelArcs,
    drawStatArcs,
    drawGroupArcs,
  };
}
