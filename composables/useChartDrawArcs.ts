import { group as d3Group } from 'd3-array';

import * as d3 from 'd3';

import type {
  d3GSelection,
  EnrichedStat,
  Category,
  Player,
  SubCategory,
  StatArcData,
  StatLabelArcData,
} from '~/types';

export function useChartDrawArcs() {
  const { getCategoryById, getSubCategoryById } = useConfigStore();
  const {
    setHoveredPlayer,
    setHoveredCategory,
    updateMousePosition,
    setTooltipStat,
    setTooltipStatLabel,
  } = useInteractionStore();
  const { arcGenerator } = useChartGenerators();
  const { radius, minRadius, proportions, restRadius, modifier, legend } = useChartConfig();

  function drawCircleBackground(g: d3GSelection) {
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('fill', modifier.color.default)
      .attr('opacity', 1);
  }

  function drawOverlayArc(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    hoveredCategory: Category | SubCategory | null,
    selectedCategories: Category[],
    selectedSubCategories: SubCategory[]
  ) {
    g.selectAll('.overlay').remove();

    const className = 'overlay-arc';

    if (!hoveredCategory) return;

    const isCategory = 'subCategories' in hoveredCategory;
    const categoryId = isCategory ? hoveredCategory.id : hoveredCategory.id.split('.')[0];

    const categoryIndex = selectedCategories.findIndex((cat) => cat.id === categoryId);

    const overlay = g.append('g').attr('class', 'overlay');

    const columnsBeforeCategory = selectedCategories
      .slice(0, categoryIndex)
      .reduce(
        (sum, cat) =>
          sum + cat.subCategories.reduce((subSum, subGroup) => subSum + subGroup.stats.length, 0),
        0
      );

    const categoryWidth = selectedCategories[categoryIndex].subCategories.reduce(
      (sum, subGroup) => sum + subGroup.stats.length,
      0
    );

    const categoryStartAngle = circleScale(columnsBeforeCategory);
    const categoryEndAngle = circleScale(columnsBeforeCategory + categoryWidth);

    if (isCategory) {
      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: minRadius,
            outerRadius: radius * proportions[3],
            startAngle: 0,
            endAngle: categoryStartAngle,
            data: null,
          })
        )
        .on('click', () => {
          setHoveredCategory(null);
        })
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);

      // Draw second part: from category end to full circle
      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: minRadius,
            outerRadius: radius * proportions[3],
            startAngle: categoryEndAngle,
            endAngle: Math.PI * 2,
            data: null,
          })
        )
        .on('click', () => {
          setHoveredCategory(null);
        })
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);
    } else {
      const subCategoryIndex = selectedSubCategories.findIndex(
        (cat) => cat.id === hoveredCategory.id
      );
      const columnsBeforeSubCategory = selectedSubCategories
        .slice(0, subCategoryIndex)
        .reduce((sum, subGroup) => sum + subGroup.stats.length, 0);

      const subCategoryWidth = selectedSubCategories[subCategoryIndex].stats.length;

      const subCategoryStartAngle = circleScale(columnsBeforeSubCategory);
      const subCategoryEndAngle = circleScale(columnsBeforeSubCategory + subCategoryWidth);

      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: minRadius,
            outerRadius: radius * proportions[2],
            startAngle: 0,
            endAngle: subCategoryStartAngle,
            data: null,
          })
        )
        .on('click', () => {
          setHoveredCategory(null);
        })
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);

      // Draw second part: from category end to full circle
      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: minRadius,
            outerRadius: radius * proportions[2],
            startAngle: subCategoryEndAngle,
            endAngle: Math.PI * 2,
            data: null,
          })
        )
        .on('click', () => {
          setHoveredCategory(null);
        })
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);

      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: radius * proportions[2],
            outerRadius: radius * proportions[3],
            startAngle: 0,
            endAngle: categoryStartAngle,
            data: null,
          })
        )
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);

      overlay
        .append('path')
        .attr('class', className)
        .attr(
          'd',
          arcGenerator({
            innerRadius: radius * proportions[2],
            outerRadius: radius * proportions[3],
            startAngle: categoryEndAngle,
            endAngle: Math.PI * 2,
            data: null,
          })
        )
        .attr('fill', modifier.color.black)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('opacity', 0.3);
    }
  }

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

      const categoryId = stat.id.split('.')[0];
      const subCategoryId = stat.id.split('.')[1];

      const category = getCategoryById(categoryId);
      if (!category) return;
      const subCategory = getSubCategoryById(category, subCategoryId);
      if (!subCategory) return;

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
            id: `${stat.id.replace(/\./g, '_')}-${player.id}`,
            index: statIndex,
            value,
            stat,
            statValue: statValue.toString(),
            player,
            category,
            subCategory,
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
          .attr('class', (d) => `${className} arc-${d.id}`)
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
          .on('mouseenter', (event, d) => {
            if (!interaction) return;

            const arc = g.select(`.stat-arc-normal.arc-${d.id}`);
            arc.classed('hover', true);

            setHoveredPlayer(d.player);
            setTooltipStat({
              id: d.id,
              playerId: d.player.id,
              playerName: d.player.info.name,
              playerColor: d.player.color,
              categoryName: d.category.name,
              subCategoryName: d.subCategory.name,
              statName: d.stat.name,
              statDescription: d.stat.description,
              value: d.statValue,
              categoryColor: d.category.color,
              record: {
                value: d.stat.record.value.toString(),
                holder: d.stat.record.name,
              },
            });
            updateMousePosition(event);
          })
          .on('mousemove', (event) => {
            if (!interaction) return;
            updateMousePosition(event);
          })
          .on('mouseleave', (_, d) => {
            if (!interaction) return;

            g.select(`.stat-arc-normal.arc-${d.id}`).classed('hover', false);

            setHoveredPlayer(null);
            setTooltipStat(null);
          })
      );

    if (interaction) return;

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
      .attr('fill', '#e0e0e0');
  }

  function drawStatLabelArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    selectedStats: EnrichedStat[],
    indices: number[],
    groups: SubCategory[],
    interaction = false
  ) {
    const className = `stat-label-arc-${interaction ? 'hover' : 'normal'}`;

    const getGroupIndex = (statIndex: number) => {
      return indices.findIndex((startIndex, i) => {
        const nextStartIndex = indices[i + 1] ?? startIndex + groups[i].stats.length;
        return statIndex >= startIndex && statIndex < nextStartIndex;
      });
    };

    const arcData: Array<StatLabelArcData> = [];

    selectedStats.forEach((stat, statIndex) => {
      const categoryId = stat.id.split('.')[0];
      const subCategoryId = stat.id.split('.')[1];

      const category = getCategoryById(categoryId);
      if (!category) return;
      const subCategory = getSubCategoryById(category, subCategoryId);
      if (!subCategory) return;

      arcData.push({
        id: `${stat.id.replace(/\./g, '_')}`,
        index: getGroupIndex(statIndex),
        stat,
        category,
        subCategory,
        startAngle: circleScale(statIndex),
        endAngle: circleScale(statIndex + 1),
      });
    });

    g.selectAll(`.${className}`)
      .data(arcData, (d) => (d as StatArcData).id)
      .join((enter) =>
        enter
          .append('path')
          .attr('class', (d) => `${className} arc-label-${d.id}`)
          .attr('d', (d) =>
            arcGenerator({
              innerRadius: radius * proportions[0],
              outerRadius: radius * proportions[1],
              startAngle: d.startAngle,
              endAngle: d.endAngle,
              data: d,
            })
          )
          .attr('fill', (d) => d.stat?.color ?? 'none')
          .attr('opacity', (d) => {
            return d.index % 2 === 0
              ? modifier.color.subCategoryLabel.background.opacity.even
              : modifier.color.subCategoryLabel.background.opacity.odd;
          })
          .on('mouseenter', (event, d) => {
            if (!interaction) return;

            const arc = g.select(`.stat-label-arc-normal.arc-label-${d.id}`);
            arc.classed('hover', true);

            setTooltipStatLabel({
              id: d.id,
              categoryName: d.category.name,
              categoryColor: d.category.color,
              subCategoryName: d.subCategory.name,
              statName: d.stat.name,
              statDescription: d.stat.description,
              record: {
                value: d.stat.record.value.toString(),
                holder: d.stat.record.name,
              },
            });
            updateMousePosition(event);
          })
          .on('mousemove', (event) => {
            if (!interaction) return;
            updateMousePosition(event);
          })
          .on('mouseleave', (_, d) => {
            if (!interaction) return;

            g.select(`.stat-label-arc-normal.arc-label-${d.id}`).classed('hover', false);
            setTooltipStatLabel(null);
          })
      );
  }

  function drawGroupArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    groups: Category[] | SubCategory[],
    layerModifier: number,
    interaction = false
  ) {
    const className = `group-arc-${interaction ? 'hover' : 'normal'}`;

    indices.forEach((startIndex, groupIndex) => {
      const group = groups[groupIndex];
      const isGroup = 'subCategories' in group;

      const groupId = `${group.id.replace(/\./g, '_')}`;

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
        .attr('class', `${className} group-arc-${groupId}`)
        .attr('d', backgroundArc)
        .attr('fill', group.color)
        .attr(
          'opacity',
          isGroup
            ? modifier.color.categoryLabel.background.opacity
            : groupIndex % 2 === 0
            ? modifier.color.subCategoryLabel.background.opacity.even
            : modifier.color.subCategoryLabel.background.opacity.odd
        )
        .on('mouseenter', () => {
          if (!interaction) return;
          const arc = g.select(`.group-arc-normal.group-arc-${groupId}`);
          arc.classed('hover', true);
        })
        .on('mouseleave', () => {
          if (!interaction) return;
          g.select(`.group-arc-normal.group-arc-${groupId}`).classed('hover', false);
        })
        .on('click', () => {
          if (!interaction) return;
          setHoveredCategory(group);
        });
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
    drawOverlayArc,
    drawCircleBackground,
    drawStatLabelArcs,
    drawStatArcs,
    drawGroupArcs,
    drawOutsideMaxStatScaleArc,
  };
}
