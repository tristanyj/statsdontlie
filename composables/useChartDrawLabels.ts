import type { d3GSelection, EnrichedColumn } from '~/types';

import { formatNumber } from '~/utils/chart/formatters';

export function useChartDrawLabels() {
  const { radius, innerRadiusPadding } = useChartDimensions();
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

  function drawColumnLabels(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    columns: EnrichedColumn[]
  ) {
    g.selectAll('.column-label').remove();

    const columnLabels = g
      .selectAll('.column-label')
      .data(columns)
      .enter()
      .append('g')
      .attr('class', 'column-label')
      .attr('transform', (d, i) => `rotate(${angleScale(i)}) translate(0, 10)`);

    columnLabels.each(function (d, i) {
      const angle = angleScale(i);
      const midAngle = angle + (angleScale(i + 1) - angle) / 2;
      const labelRadius = radius * 1.08;

      const rotation = (midAngle * 180) / Math.PI - 90;
      const textAnchor = midAngle > Math.PI ? 'end' : 'start';
      const finalRotation = rotation + (midAngle > Math.PI ? 180 : 0);

      // Calculate position for group label
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);

      const textGroup = g.append('g').attr('class', 'column-label');

      textGroup
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#000')
        .attr('font-size', 10)
        .attr('transform', `rotate(${finalRotation},${x},${y})`)
        .text(d.name);
    });
  }

  function drawColumnScales(
    g: d3GSelection,
    angleScale: d3.ScaleLinear<number, number>,
    columns: EnrichedColumn[]
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
      .data(columns)
      .enter()
      .append('g')
      .attr('class', 'column-scale')
      .attr('transform', (d, i) => `rotate(${angleScale(i)}) translate(0, 10)`);

    columnScales.each(function (d, i) {
      const startAngle = angleScale(i);
      const endAngle = angleScale(i + 1);
      const midAngle = (startAngle + endAngle) / 2;
      const shouldFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
      const baseRadius = radius * innerRadiusPadding;

      labels.forEach((label) => {
        const labelId = `label-path-${d.id}-${label.position}`;
        const scaleOffset = label.position * (radius - baseRadius);
        const flipOffset = shouldFlip ? 7.5 : 0;
        const startOffset = label.position === 0.0 ? 5 : 0;
        const standardRadius = baseRadius + scaleOffset + flipOffset + startOffset;
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
    drawColumnLabels,
    drawColumnScales,
  };
}
