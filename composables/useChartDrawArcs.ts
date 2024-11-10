import { group as d3Group } from 'd3-array';
//

import type {
  d3GSelection,
  EnrichedStat,
  Category,
  Player,
  SubCategory,
  StatArcData,
} from '~/types';

export function useChartDrawArcs() {
  const { setHoveredPlayer, updateMousePosition, setTooltipData } = useInteractionStore();
  const { arcGenerator } = useChartGenerators();
  const { radius, minRadius, proportions, restRadius, modifier, legend } = useChartConfig();

  function drawStatArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    selectedStats: EnrichedStat[],
    selectedPlayers: Player[],
    interaction = false
  ) {
    const className = `stat-arc-${interaction ? 'hover' : 'normal'}`;
    const arcData: Array<StatArcData> = [];

    selectedStats.forEach((stat, statIndex) => {
      const playerCategoriesByIdenticalStat = d3Group(
        selectedPlayers,
        (player) => player.stats[stat.id]
      );

      const sortedValues = Array.from(playerCategoriesByIdenticalStat.keys())
        .filter((value) => value !== undefined)
        .sort((a, b) => (b || 0) - (a || 0));

      sortedValues.forEach((statValue) => {
        const playersWithValue = playerCategoriesByIdenticalStat.get(statValue) || [];
        const playerCount = playersWithValue.length;

        const startAngle = circleScale(statIndex);
        const endAngle = circleScale(statIndex + 1);
        const individualArcWidth = (endAngle - startAngle) / playerCount;

        playersWithValue.forEach((player, playerIndex) => {
          const arcStartAngle = startAngle + individualArcWidth * playerIndex;
          const arcEndAngle = arcStartAngle + individualArcWidth;

          const value = stat.meta.scale(statValue);

          arcData.push({
            id: `${stat.id}-${player.id}`,
            index: statIndex,
            value,
            stat,
            player,
            startAngle: arcStartAngle,
            endAngle: arcEndAngle,
          });
        });
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
              startAngle: d.startAngle,
              endAngle: d.endAngle,
              data: d,
            })
          )
          .attr('fill', (d) => d.player.color)
          .attr('opacity', 0)
          .on('mouseenter', (event, d) => {
            if (!interaction) return;
            setHoveredPlayer(d.player);
            setTooltipData({ id: d.id });
            updateMousePosition(event);
          })
          .on('mousemove', (event) => {
            if (!interaction) return;
            updateMousePosition(event);
          })
          .on('mouseleave', () => {
            if (!interaction) return;
            setHoveredPlayer(null);
            setTooltipData(null);
          })
          .call((enter) => {
            if (interaction) return;
            enter.transition().duration(0).attr('opacity', 1);
          })
      );

    // Draw legend arc
    g.append('path')
      .attr('class', 'legend-arc')
      .attr(
        'd',
        arcGenerator({
          innerRadius: minRadius,
          outerRadius: minRadius + restRadius * 0.75,
          startAngle: circleScale(selectedStats.length),
          endAngle: circleScale(selectedStats.length + legend.columnCount),
          data: null,
        })
      )
      .attr('fill', modifier.color.default)
      .attr('opacity', 0)
      .call((enter) => {
        if (interaction) return;
        enter.transition().duration(0).attr('opacity', 1);
      });
  }

  function drawStatLabelArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    selectedStats: EnrichedStat[],
    indices: number[], // Add indices parameter
    groups: SubCategory[] // Add groups parameter, specifically SubCategory[]
  ) {
    const className = 'stat-label-arc';

    const getGroupIndex = (statIndex: number) => {
      return indices.findIndex((startIndex, i) => {
        const nextStartIndex = indices[i + 1] ?? startIndex + groups[i].stats.length;
        return statIndex >= startIndex && statIndex < nextStartIndex;
      });
    };

    g.selectAll(`.${className}`)
      .data(
        selectedStats
          .map((data, i) => ({
            innerRadius: radius * proportions[0],
            outerRadius: radius * proportions[1],
            startAngle: circleScale(i),
            endAngle: circleScale(i + 1),
            data,
            groupIndex: getGroupIndex(i),
          }))
          .concat([
            {
              innerRadius: radius * proportions[0],
              outerRadius: radius * proportions[1],
              startAngle: circleScale(selectedStats.length),
              endAngle: circleScale(selectedStats.length + legend.columnCount),
              data: null as unknown as EnrichedStat,
              groupIndex: -1,
            },
          ])
      )
      .join('path')
      .attr('class', className)
      .attr('d', arcGenerator)
      .attr('fill', (d) => d.data?.color ?? 'none')
      .attr('opacity', (d) => {
        if (d.groupIndex === -1) return 0;
        return d.groupIndex % 2 === 0
          ? modifier.color.subCategoryLabel.background.opacity.even
          : modifier.color.subCategoryLabel.background.opacity.odd;
      });
  }

  function drawGroupArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    groups: Category[] | SubCategory[],
    layerModifier: number
  ) {
    indices.forEach((startIndex, groupIndex) => {
      const group = groups[groupIndex];
      const isGroup = 'subCategories' in group;

      const nextGroupStartIndex =
        indices[groupIndex + 1] ??
        startIndex +
          (isGroup
            ? (group as Category).subCategories.reduce((sum, sg) => sum + sg.stats.length, 0)
            : group.stats.length);

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextGroupStartIndex);

      const backgroundArc = arcGenerator({
        innerRadius: radius * proportions[3 - layerModifier],
        outerRadius: radius * proportions[2 - layerModifier],
        startAngle,
        endAngle,
        data: group,
      });

      g.append('path')
        .attr('d', backgroundArc)
        .attr('fill', group.color)
        .attr(
          'opacity',
          isGroup
            ? modifier.color.categoryLabel.background.opacity
            : groupIndex % 2 === 0
            ? modifier.color.subCategoryLabel.background.opacity.even
            : modifier.color.subCategoryLabel.background.opacity.odd
        );
    });
  }

  function drawOutsideMaxStatScaleArc(g: d3GSelection) {
    g.append('path')
      .attr(
        'd',
        arcGenerator({
          innerRadius: radius * proportions[0],
          outerRadius: radius * proportions[0] * modifier.radius.outsideMaxStatScale,
          startAngle: 0,
          endAngle: Math.PI * 2,
          data: null,
        })
      )
      .attr('fill', modifier.color.white)
      .attr('opacity', modifier.color.scaleLabel.last.background.opacity);
  }

  return {
    drawStatLabelArcs,
    drawStatArcs,
    drawGroupArcs,
    drawOutsideMaxStatScaleArc,
  };
}
