export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 1400;
  const margin = 1;

  // ------------------------------
  // Positions
  // ------------------------------

  const scalePositions = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const layerCount = 20;

  // ------------------------------
  // Proportions
  // ------------------------------

  const percentages = [64, 23, 5, 8];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  // ------------------------------
  // Radius
  // ------------------------------

  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.2;
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
      lowOpacity: 0.075,
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
    donut: {
      center: {
        top: -12,
        bottom: 8,
      },
      arc: {
        top: 18,
        bottom: 10,
      },
    },
    groupLabel: {
      standard: 25,
      flip: 33,
    },
    subGroupLabel: {
      standard: 12,
      flip: 20,
    },
    scaleLabel: {
      standard: 0,
      flip: 7.5,
      start: 5,
      end: 4,
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
    outsideMaxStatScale: 1.0325,
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
    layerCount,
    modifier,
    innerRadiusPadding,
    scalePositions,
  };
}
