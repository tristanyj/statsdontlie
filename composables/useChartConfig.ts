export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 1400;
  const margin = 1;
  const padAngle = 0.001;

  // ------------------------------
  // Scale Positions
  // ------------------------------

  const scalePositions = [0.0, 0.25, 0.5, 0.75, 1.0];

  // ------------------------------
  // Proportions
  // ------------------------------

  const percentages = [68, 22, 5, 5];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  // ------------------------------
  // Radius
  // ------------------------------

  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.25;
  const minRadius = radius * proportions[0] * innerRadiusPadding;
  const restRadius = radius * proportions[0] * (1 - innerRadiusPadding);
  const maxRadius = radius;

  // ------------------------------
  // Text wrapping
  // ------------------------------

  const maxWidth = 100;
  const lineHeight = 14;

  const wrap = {
    maxWidth,
    lineHeight,
  };

  // ------------------------------
  // Modifiers
  // ------------------------------

  const colorModifier = {
    scaleLabel: {
      background: {
        color: '#f9fafb',
        opacity: 0.9,
      },
    },
    separator: {
      stroke: '#000',
      lowOpacity: 0.1,
      highOpacity: 0.7,
    },
  };

  const fontModifier = {
    statLabel: 11,
    groupLabel: 11,
    subGroupLabel: 11,
    scaleLabel: 10,
  };

  const spaceModifier = {
    groupLabel: {
      standard: 12,
      flip: 20,
    },
    scaleLabel: {
      standard: 0,
      flip: 7.5,
      start: 5,
      end: 3,
      text: {
        height: 8,
        padding: 1.5,
      },
      background: {
        standard: 4,
        flip: -3.5,
      },
    },
  };

  const radiusModifier = {
    outsideMaxStatScale: 1.035,
    insideMinStatScale: 0.9,
    statLabel: 1.08,
  };

  const modifier = {
    radius: radiusModifier,
    space: spaceModifier,
    font: fontModifier,
    color: colorModifier,
  };

  return {
    width,
    height,
    margin,
    radius,
    minRadius,
    maxRadius,
    restRadius,
    proportions,
    wrap,
    modifier,
    innerRadiusPadding,
    scalePositions,
    padAngle,
  };
}
