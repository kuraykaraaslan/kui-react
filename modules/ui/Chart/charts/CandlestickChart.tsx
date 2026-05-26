'use client';
// modules/ui/Chart/charts/CandlestickChart.tsx
//
// M3 stub. Returns null. Implement in M3.
//
// TODO M3: OHLC + candlestick body rendering. Each data point needs
// `open`, `high`, `low`, `close` (extend SeriesPoint or accept a
// dedicated OHLCPoint[]). Bullish = `var(--success)`, bearish = `var(--error)`.

type CandlestickChartProps = {
  /** TODO M3: { x, open, high, low, close }[] */
  data?: unknown[];
  className?: string;
};

export function CandlestickChart(_props: CandlestickChartProps) {
  // TODO M3: implement candlestick + OHLC bars.
  return null;
}
