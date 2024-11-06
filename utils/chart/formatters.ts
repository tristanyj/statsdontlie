const formatNumber = (value: number) => {
  // k for thousands, M for millions, B for billions
  if (value < 1e3) return value;
  if (value < 1e6) return `${(value / 1e3).toFixed(0)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
};

export { formatNumber };
