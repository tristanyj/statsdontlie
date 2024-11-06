export function useChartConfig() {
  const width = 1400;
  const height = 1400;
  const margin = 1;

  // Pad angle for the arcs
  const padAngle = 0.001;

  // proportions
  const percentages = [68, 22, 5, 5];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  // Radius
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
  // Radius Modifier
  // ------------------------------

  const r = {
    statLabel: 1.08,
  };

  const modifier = {
    radius: r,
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
    padAngle,
  };
}
