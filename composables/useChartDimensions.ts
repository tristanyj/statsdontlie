export function useChartDimensions() {
  const width = 1400;
  const height = 1400;
  const margin = 1;

  // Pad angle for the arcs
  const padAngle = 0.001;

  // Radius
  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.25;

  // proportions
  const percentages = [68, 22, 5, 5];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  const minRadius = radius * proportions[0] * innerRadiusPadding;
  const restRadius = radius * proportions[0] * (1 - innerRadiusPadding);
  const maxRadius = radius;

  // proportions

  return {
    width,
    height,
    margin,
    radius,
    minRadius,
    maxRadius,
    restRadius,
    proportions,
    innerRadiusPadding,
    padAngle,
  };
}
