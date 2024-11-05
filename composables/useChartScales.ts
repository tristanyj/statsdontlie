import * as d3 from 'd3';

export function useChartScales() {
  const scales = {
    angle: d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, 2 * Math.PI]),
  };

  function updateScale(key: keyof typeof scales, domain: [number, number]) {
    // console.log('Updating scale:', domain);

    scales[key].domain(domain);
  }

  return {
    scales,
    updateScale,
  };
}
