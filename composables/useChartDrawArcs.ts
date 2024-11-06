import type { d3GSelection, EnrichedStat, Group, Player, SubGroup, StatArcData } from '~/types';

export function useChartDrawArcs() {
  const { arcGenerator } = useChartGenerators();
  const { radius, minRadius, proportions, restRadius } = useChartConfig();

  function drawStatArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedStats: EnrichedStat[],
    selectedPlayers: Player[]
  ) {
    const className = 'stat-arc';
    const arcData: Array<StatArcData> = [];

    selectedStats.forEach((stat, i) => {
      selectedPlayers
        .sort((a, b) => {
          const aStat = a.stats[stat.id];
          const bStat = b.stats[stat.id];
          return (bStat || 0) - (aStat || 0);
        })
        .forEach((player) => {
          const s = player.stats[stat.id];
          if (s) {
            const value = stat.meta.scale(s);
            arcData.push({
              id: `${stat.id}-${player.id}`,
              index: i,
              color: player.colors[0],
              value,
            });
          }
        });
    });

    g.selectAll(`.${className}`)
      .data(arcData, (d) => (d as StatArcData).id)
      .join((enter) =>
        enter
          .append('path')
          .attr('class', className)
          .attr('d', (d) =>
            arcGenerator({
              innerRadius: minRadius,
              outerRadius: minRadius + restRadius * d.value,
              startAngle: angleScale(d.index),
              endAngle: angleScale(d.index + 1),
              data: d,
            })
          )
          .attr('fill', (d) => d.color)
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(0).attr('opacity', 1))
      );
  }

  function drawStatLabelArcs(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    selectedStats: EnrichedStat[]
  ) {
    const className = 'stat-label-arc';

    g.selectAll(`.${className}`)
      .data(
        selectedStats.map((data, i) => ({
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
            ? (group as Group).subGroups.reduce((sum, sg) => sum + sg.stats.length, 0)
            : group.stats.length);

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
