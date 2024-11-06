import type { d3GSelection, EnrichedStat, Group, SubGroup } from '~/types';

import { wrapText, formatNumber } from '~/assets/scripts/utils';

export function useChartDrawLabels() {
  const { radius, minRadius, proportions, wrap, modifier } = useChartConfig();
  const { arcGenerator } = useChartGenerators();

  function drawStatLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    const className = 'stat-label';

    stats.forEach(function (d, i) {
      const startAngle = angleScale(i);
      const midAngle = startAngle + (angleScale(i + 1) - startAngle) / 2;
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
          .attr('font-size', 11)
          .attr('transform', `rotate(${rotation},${x},${y})`)
          .text(line);
      });
    });
  }

  function drawGroupLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    groups: Group[] | SubGroup[],
    modifier: number
  ) {
    indices.forEach((startIndex, groupIndex) => {
      const group = groups[groupIndex];
      // TODO: refactor to helper function
      const nextGroupStartIndex =
        indices[groupIndex + 1] ??
        startIndex +
          ('subGroups' in group
            ? (group as Group).subGroups.reduce((sum, sg) => sum + sg.stats.length, 0)
            : group.stats.length);

      // TODO: refactor to helper function
      const startAngle = angleScale(startIndex);
      const endAngle = angleScale(nextGroupStartIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
      const offset = shouldFlip ? 21 : 13;
      const labelRadius = radius * proportions[2 - modifier] + offset;

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
    });
  }

  function drawScaleLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    g.selectAll('.column-scale').remove();

    const labels = [
      { position: 0.0 },
      { position: 0.25 },
      { position: 0.5 },
      { position: 0.75 },
      { position: 1.0 },
    ];

    const columnScales = g
      .selectAll('.column-scale')
      .data(stats)
      .enter()
      .append('g')
      .attr('class', 'column-scale')
      .attr('transform', (d, i) => `rotate(${angleScale(i)}) translate(0, 10)`);

    columnScales.each(function (d, i) {
      const startAngle = angleScale(i);
      const endAngle = angleScale(i + 1);
      const midAngle = (startAngle + endAngle) / 2;
      const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;

      labels.forEach((label) => {
        const labelId = `label-path-${d.id}-${label.position}`;
        const scaleOffset = label.position * (radius * proportions[0] - minRadius);
        const flipOffset = shouldFlip ? 7.5 : 0;
        const startOffset = label.position === 0.0 ? 5 : 0;
        const standardRadius = minRadius + scaleOffset + flipOffset + startOffset;
        const labelRadius = label.position === 1.0 ? standardRadius + 3 : standardRadius;
        const backgroundRadius = shouldFlip ? labelRadius - 3.5 : labelRadius + 4;

        // @ts-expect-error - TS doesn't know about the scale function
        const value = formatNumber(d.meta.scale.invert(label.position));
        const textContent = `${value}`;

        // Create the path for text positioning
        g.append('path')
          .attr('id', labelId)
          .attr(
            'd',
            arcGenerator({
              innerRadius: labelRadius,
              outerRadius: labelRadius,
              startAngle: shouldFlip ? endAngle : startAngle,
              endAngle: shouldFlip ? startAngle : endAngle,
              data: label,
            })
          );
        // .attr('stroke', getRandomColor());

        const tempText = g
          .append('text')
          .append('textPath')
          .attr('href', `#${labelId}`)
          .style('font-size', '10px')
          .text(textContent);
        const textHeight = 8; // Approximate height of the text
        const textLength = tempText.node()?.getComputedTextLength() || 0;
        tempText.remove();

        // Calculate the arc length needed for this text
        const padding = 1.5; // Padding around text
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

        // Create background path that's just wide enough for the text
        if (label.position !== 1.0) {
          g.append('path')
            .attr(
              'd',
              arcGenerator({
                innerRadius: backgroundRadius - (textHeight / 2 + padding),
                outerRadius: backgroundRadius + (textHeight / 2 + padding),
                startAngle: bgStartAngle,
                endAngle: bgEndAngle,
                data: label,
              })
            )
            .attr('fill', '#f9fafb')
            .attr('opacity', 0.9);
        }

        g.append('text')
          .append('textPath')
          .attr('href', `#${labelId}`)
          .attr('startOffset', `${textOffsetPercentage}%`)
          .style('font-size', '10px')
          .text(textContent);
      });
    });
  }

  return {
    drawGroupLabels,
    drawStatLabels,
    drawScaleLabels,
  };
}
