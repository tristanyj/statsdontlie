import type { d3GSelection, EnrichedStat, Group, SubGroup } from '~/types';

// import { formatNumber } from '~/utils/chart/formatters';

const formatNumber = (value: number) => {
  // k for thousands, M for millions, B for billions
  if (value < 1e3) return value;
  if (value < 1e6) return `${(value / 1e3).toFixed(0)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
};

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/).reverse();
  const lines: string[] = [];
  let line: string[] = [];
  let lineLength = 0;
  const spaceWidth = 4; // Approximate space width

  while (words.length > 0) {
    const word = words.pop()!;
    const wordWidth = word.length * 5.5; // Approximate width per character

    if (lineLength + wordWidth + (line.length > 0 ? spaceWidth : 0) > width) {
      if (line.length > 0) {
        lines.push(line.join(' '));
        line = [word];
        lineLength = wordWidth;
      } else {
        // If single word is too long, just add it
        lines.push(word);
      }
    } else {
      line.push(word);
      lineLength += wordWidth + (line.length > 0 ? spaceWidth : 0);
    }
  }

  if (line.length > 0) {
    lines.push(line.join(' '));
  }

  return lines;
}

export function useChartDrawLabels() {
  const { radius, minRadius, proportions } = useChartDimensions();
  const { arcGenerator } = useChartGenerators();

  function createTextWithBackground(
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    options: {
      x: number;
      y: number;
      text: string;
      textColor?: string;
      backgroundColor?: string;
      padding?: { x: number; y: number };
      borderRadius?: number;
    }
  ) {
    const {
      x,
      y,
      text,
      textColor = '#fff',
      backgroundColor = '#000',
      padding = { x: 5, y: 3 },
      borderRadius = 3,
    } = options;

    // Create a group for the background and text
    const textGroup = selection.append('g').attr('class', 'text-with-background');

    // Add the text first (but don't display it) to calculate its size
    const textElement = textGroup
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', textColor)
      .attr('font-size', 24)
      .text(text);

    // Get the bounding box of the text
    const bbox = textElement.node()?.getBBox();

    if (bbox) {
      // Add the background rectangle
      textGroup
        .insert('rect', 'text') // Insert before text
        .attr('x', bbox.x - padding.x)
        .attr('y', bbox.y - padding.y)
        .attr('width', bbox.width + padding.x * 2)
        .attr('height', bbox.height + padding.y * 2)
        .attr('rx', borderRadius)
        .attr('ry', borderRadius)
        .attr('fill', backgroundColor)
        .attr('opacity', 0.8);
    }

    return textGroup;
  }

  function drawStatLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    g.selectAll('.column-label').remove();

    const maxWidth = 100; // Adjust this value based on your needs
    const lineHeight = 14; // Adjust line height as needed

    const columnLabels = g
      .selectAll('.column-label')
      .data(stats)
      .enter()
      .append('g')
      .attr('class', 'column-label')
      .attr('transform', (d, i) => `rotate(${angleScale(i)}) translate(0, 10)`);

    columnLabels.each(function (d, i) {
      const angle = angleScale(i);
      const midAngle = angle + (angleScale(i + 1) - angle) / 2;
      const labelRadius = radius * proportions[0] * 1.08;

      const rotation = (midAngle * 180) / Math.PI - 90;
      const textAnchor = midAngle > Math.PI ? 'end' : 'start';
      const finalRotation = rotation + (midAngle > Math.PI ? 180 : 0);

      // Calculate position for group label
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);

      const textGroup = g.append('g').attr('class', 'column-label');

      const lines = wrapText(d.name, maxWidth);

      const totalHeight = lines.length * lineHeight;
      const startY = y - totalHeight / 2 + lineHeight / 2;

      lines.forEach((line, lineIndex) => {
        textGroup
          .append('text')
          .attr('x', x)
          .attr('y', startY + lineIndex * lineHeight)
          .attr('text-anchor', textAnchor)
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#000')
          .attr('font-size', 11)
          .attr('transform', `rotate(${finalRotation},${x},${y})`)
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
    createTextWithBackground,
    drawGroupLabels,
    drawStatLabels,
    drawScaleLabels,
  };
}
