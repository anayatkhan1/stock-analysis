import { ChartDataItem } from "./types";

/**
 * Technical Analysis Utilities
 * 
 * This file contains functions for calculating technical indicators
 */

/**
 * Calculate Simple Moving Average (SMA)
 * 
 * @param data Array of price data
 * @param period Number of periods to calculate SMA
 * @returns Array of SMA values
 */
export function calculateSMA(data: ChartDataItem[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  
  // We need at least 'period' data points to calculate SMA
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Not enough data points yet, fill with null
      result.push(null);
    } else {
      // Calculate sum of last 'period' prices
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].price;
      }
      // Calculate average
      result.push(parseFloat((sum / period).toFixed(2)));
    }
  }
  
  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 * 
 * @param data Array of price data
 * @param period Number of periods to calculate EMA
 * @returns Array of EMA values
 */
export function calculateEMA(data: ChartDataItem[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA value is the same as SMA
  let ema: number | null = null;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Not enough data points yet, fill with null
      result.push(null);
    } else if (i === period - 1) {
      // First EMA value is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].price;
      }
      ema = sum / period;
      result.push(parseFloat(ema.toFixed(2)));
    } else {
      // Calculate EMA: EMA = Price * multiplier + EMA(previous) * (1 - multiplier)
      if (ema !== null) {
        ema = (data[i].price * multiplier) + (ema * (1 - multiplier));
        result.push(parseFloat(ema.toFixed(2)));
      }
    }
  }
  
  return result;
}

/**
 * Technical Analysis Method Type
 */
export type TechnicalAnalysisMethod = {
  id: string;
  name: string;
  description: string;
  defaultPeriod?: number;
  minPeriod?: number;
  maxPeriod?: number;
  color?: string;
};

/**
 * Available Technical Analysis Methods
 */
export const technicalAnalysisMethods: TechnicalAnalysisMethod[] = [
  {
    id: "sma",
    name: "Simple Moving Average (SMA)",
    description: "Average price over a specific number of periods",
    defaultPeriod: 20,
    minPeriod: 5,
    maxPeriod: 200,
    color: "rgba(75, 192, 192, 1)",
  },
  {
    id: "ema",
    name: "Exponential Moving Average (EMA)",
    description: "Weighted moving average that gives more importance to recent prices",
    defaultPeriod: 20,
    minPeriod: 5,
    maxPeriod: 200,
    color: "rgba(153, 102, 255, 1)",
  },
];