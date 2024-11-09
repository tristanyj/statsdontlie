export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 1400;
  const margin = 1;

  // ------------------------------
  // Proportions
  // ------------------------------

  const percentages = [65, 23, 5, 7];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  // ------------------------------
  // Radius
  // ------------------------------

  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.225;
  const minRadius = radius * proportions[0] * innerRadiusPadding;
  const restRadius = radius * proportions[0] * (1 - innerRadiusPadding);
  const maxRadius = radius;

  // ------------------------------
  // Positions
  // ------------------------------

  const scalePositions = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const layerCount = 20;

  // ------------------------------
  // Legend
  // ------------------------------

  const legend = {
    columnCount: 1,
    statLabel: 'Statistic Name',
    groupLabel: 'Legend',
    subCategoryLabel: 'Category',
    scaleLabel: 'Scale Label',
    scales: scalePositions.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: curr === 1 ? 'NFL Record among QBs' : `${(curr * 100).toString()}%`,
      };
    }, {}),
  };

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

  const colors = {
    default: '#f0f0f0',
    white: '#fff',
    black: '#000',
  };

  const colorModifier = {
    default: colors.default,
    white: colors.white,
    groupLabel: {
      background: {
        opacity: 0.7,
      },
    },
    subCategoryLabel: {
      background: {
        opacity: 0.7,
      },
    },
    statLabel: {
      background: {
        opacity: 0.7,
      },
    },
    scaleLabel: {
      last: {
        background: {
          color: colors.white,
          opacity: 0.6,
        },
      },
      background: {
        color: colors.white,
        opacity: 0.9,
      },
    },
    separator: {
      stroke: colors.black,
      lowOpacity: 0.075,
      highOpacity: 0.7,
    },
  };

  const fontModifier = {
    statLabel: 11,
    groupLabel: 12,
    subCategoryLabel: 11,
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
      standard: 20,
      flip: 28,
    },
    subCategoryLabel: {
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
    legend,
    modifier,
    innerRadiusPadding,
    scalePositions,
  };
}
