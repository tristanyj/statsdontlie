export function useChartDimensions() {
  const width = 1000;
  const height = 1000;
  const margin = 100;
  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.1;
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
