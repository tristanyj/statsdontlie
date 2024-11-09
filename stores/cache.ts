import * as d3 from 'd3';
import { formatNumber } from '~/assets/scripts/utils';

import type { Stat } from '~/types';

export const useCacheStore = defineStore('cache', () => {
  const scaleCache = new Map<
    string,
    d3.ScaleContinuousNumeric<number, number> | d3.ScaleThreshold<number, number>
  >();
  const formatCache = new Map<string, (n: number, decimals: number) => string>();

  const getScale = (column: Stat) => {
    const cacheKey = `${column.id}-${column.meta.scaleType}-${column.meta.domain}`;

    if (!scaleCache.has(cacheKey)) {
      const scale = (() => {
        switch (column.meta.scaleType) {
          case 'linear':
            return d3.scaleLinear().domain(column.meta.domain).range([0, 1]);
          case 'log':
            return d3.scaleLog().domain(column.meta.domain).range([0, 1]);
          default:
            return d3.scaleLinear().domain(column.meta.domain).range([0, 1]);
        }
      })();

      scaleCache.set(cacheKey, scale);
    }

    return scaleCache.get(cacheKey)!;
  };

  const getFormat = (column: Stat) => {
    const cacheKey = `${column.id}-${column.meta.formatType}`;

    if (!formatCache.has(cacheKey)) {
      const formatter = (() => {
        switch (column.meta.formatType) {
          case 'number':
            return (n: number, decimals: number) => formatNumber(n, decimals);
          case 'percent':
            return (n: number, decimals: number) => `${n.toFixed(decimals ?? 1)}%`;
          default:
            return (n: number) => formatNumber(n);
        }
      })();

      formatCache.set(cacheKey, formatter);
    }

    return formatCache.get(cacheKey)!;
  };

  onUnmounted(() => {
    scaleCache.clear();
    formatCache.clear();
  });

  return {
    getScale,
    getFormat,
  };
});
