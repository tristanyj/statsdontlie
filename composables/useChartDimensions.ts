export function useChartDimensions() {
  const width = 1400;
  const height = 1400;
  const margin = 300;
  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.25;
  const padAngle = 0.0025;

  return {
    width,
    height,
    margin,
    radius,
    innerRadiusPadding,
    padAngle,
  };
}
