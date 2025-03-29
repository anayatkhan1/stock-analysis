// Stock market data types
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
  lastUpdated: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface MarketSummary {
  advancers: number;
  decliners: number;
  unchanged: number;
  totalVolume: number;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
}

export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SectorPerformance {
  sector: string;
  change: number;
}

export interface ChartDataItem {
  date: string;
  price: number;
  volume: number;
}

export interface TechnicalIndicator {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'trend' | 'volatility' | 'volume';
}