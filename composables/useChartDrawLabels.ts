import type { d3GSelection, EnrichedStat, Group, SubGroup } from '~/types';

import { wrapText, shouldFlipText } from '~/assets/scripts/utils';

export function useChartDrawLabels() {
  const { radius, minRadius, scalePositions, proportions, wrap, modifier } = useChartConfig();
  const { arcGenerator } = useChartGenerators();

  function drawStatLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    const className = 'stat-label';

    stats.forEach(function (d, i) {
      const startAngle = circleScale(i);
      const midAngle = startAngle + (circleScale(i + 1) - startAngle) / 2;
      const labelRadius = radius * proportions[0] * modifier.radius.statLabel;

      const textGroup = g.append('g').attr('class', className);
      const lines = wrapText(d.name, wrap.maxWidth);

      const textAnchor = midAngle > Math.PI ? 'end' : 'start';
      const rotation = (midAngle * 180) / Math.PI - 90 + (midAngle > Math.PI ? 180 : 0);
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);
      const totalHeight = lines.length * wrap.lineHeight;
      const startY = y - totalHeight / 2 + wrap.lineHeight / 2;

      lines.forEach((line, i) => {
        textGroup
          .append('text')
          .attr('x', x)
          .attr('y', startY + i * wrap.lineHeight)
          .attr('text-anchor', textAnchor)
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#000')
          .attr('font-size', modifier.font.statLabel)
          .attr('transform', `rotate(${rotation},${x},${y})`)
          .text(line);
      });
    });
  }

  function drawGroupLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    groups: Group[] | SubGroup[],
    isGroup: boolean
  ) {
    const layerModifier = isGroup ? 0 : 1;
    const spaceModifier = isGroup ? modifier.space.groupLabel : modifier.space.subGroupLabel;

    indices.forEach((startIndex, groupIndex) => {
      const group = groups[groupIndex];
      const id = `label-path-${group.id}`;

      const nextGroupStartIndex =
        indices[groupIndex + 1] ??
        startIndex +
          (isGroup
            ? (group as Group).subGroups.reduce((sum, sg) => sum + sg.stats.length, 0)
            : (group as SubGroup).stats.length);

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextGroupStartIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const shouldFlip = shouldFlipText(midAngle);
      const offset = shouldFlip ? spaceModifier.flip : spaceModifier.standard;
      const labelRadius = radius * proportions[2 - layerModifier] + offset;

      const textArc = arcGenerator({
        innerRadius: labelRadius,
        outerRadius: labelRadius,
        startAngle: shouldFlip ? endAngle : startAngle,
        endAngle: shouldFlip ? startAngle : endAngle,
        data: group,
      });

      const tempText = g
        .append('text')
        .style(
          'font-size',
          layerModifier !== 0 ? modifier.font.subGroupLabel : modifier.font.groupLabel
        )
        .text(group.name)
        .style('visibility', 'hidden');
      const textLength = tempText.node()?.getComputedTextLength() || 0;
      tempText.remove();

      const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
      const textPercentage = (textLength / arcLength) * 100;
      const textOffsetPercentage = (100 - textPercentage) / 4;

      g.append('path').attr('id', id).attr('d', textArc).attr('fill', 'none');

      g.append('text')
        .append('textPath')
        .attr('href', `#${id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style(
          'font-size',
          layerModifier !== 0 ? modifier.font.subGroupLabel : modifier.font.groupLabel
        )
        .text(group.name);
    });
  }

  function drawScaleLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    stats.forEach(function (d, i) {
      const startAngle = circleScale(i);
      const endAngle = circleScale(i + 1);
      const midAngle = (startAngle + endAngle) / 2;
      const shouldFlip = shouldFlipText(midAngle);

      scalePositions.forEach((position) => {
        const id = `label-path-${d.id}-${position}`;

        const scaleOffset = position * (radius * proportions[0] - minRadius);
        const flipOffset = shouldFlip
          ? modifier.space.scaleLabel.flip
          : modifier.space.scaleLabel.standard;
        const startOffset = position === 0.0 ? modifier.space.scaleLabel.start : 0;
        const endOffset = position === 1.0 ? modifier.space.scaleLabel.end : 0;

        const labelRadius = minRadius + scaleOffset + flipOffset + startOffset + endOffset;
        const backgroundRadius = shouldFlip
          ? labelRadius + modifier.space.scaleLabel.background.flip
          : labelRadius + modifier.space.scaleLabel.background.standard;

        const value = d.meta.format(
          // @ts-expect-error - TS doesn't know about the scale function
          d.meta.scale.invert(position),
          position === 0.0 ? 0 : position === 1.0 ? 3 : 1
        );

        g.append('path')
          .attr('id', id)
          .attr(
            'd',
            arcGenerator({
              innerRadius: labelRadius,
              outerRadius: labelRadius,
              startAngle: shouldFlip ? endAngle : startAngle,
              endAngle: shouldFlip ? startAngle : endAngle,
              data: position,
            })
          );

        const tempText = g
          .append('text')
          .append('textPath')
          .attr('href', `#${id}`)
          .style('font-size', modifier.font.scaleLabel)
          .text(value);
        const textHeight = modifier.space.scaleLabel.text.height;
        const textLength = tempText.node()?.getComputedTextLength() || 0;
        tempText.remove();

        // Calculate the arc length needed for this text
        const padding = modifier.space.scaleLabel.text.padding;
        const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
        const textPercentage = (textLength / arcLength) * 100;
        const restPercentage = 100 - textPercentage;
        const textOffsetPercentage = restPercentage / 4;

        // Calculate the angle that corresponds to this arc length
        const backgroundArcLength = textLength + padding * 2;
        const angleForArc = backgroundArcLength / backgroundRadius;

        // Calculate start and end angles for the background
        const bgStartAngle = midAngle - angleForArc / 2;
        const bgEndAngle = midAngle + angleForArc / 2;

        if (position !== 1.0) {
          g.append('path')
            .attr(
              'd',
              arcGenerator({
                innerRadius: backgroundRadius - (textHeight / 2 + padding),
                outerRadius: backgroundRadius + (textHeight / 2 + padding),
                startAngle: bgStartAngle,
                endAngle: bgEndAngle,
                data: position,
              })
            )
            .attr('fill', modifier.color.scaleLabel.background.color)
            .attr('opacity', modifier.color.scaleLabel.background.opacity);
        }

        g.append('text')
          .append('textPath')
          .attr('href', `#${id}`)
          .attr('startOffset', `${textOffsetPercentage}%`)
          .style('font-size', modifier.font.scaleLabel)
          .text(value);
      });
    });
  }

  return {
    drawGroupLabels,
    drawStatLabels,
    drawScaleLabels,
  };
}
