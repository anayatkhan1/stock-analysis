import {
	MarketIndex,
	MarketSummary,
	SectorPerformance,
	StockData,
	StockHistoricalData,
} from "./types";

// Generate historical data for market indices
export const generateHistoricalData = (
	baseValue: number,
	volatility: number = 50,
): StockHistoricalData[] => {
	// Generate 5 years of data (approximately 1825 days)
	return Array.from({ length: 1825 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (1825 - i));

		// Base value with some randomness and long-term trends
		// Add some cyclical patterns for more realistic data
		const yearCycle = Math.sin(i / 365) * (baseValue * 0.15); // Yearly cycle
		const quarterCycle = Math.sin(i / 90) * (baseValue * 0.05); // Quarterly cycle
		const monthCycle = Math.sin(i / 30) * (baseValue * 0.02); // Monthly cycle

		// Create a general trend upward over time (about 7% per year on average)
		const trend = baseValue * (i / 1825) * 0.35;

		const adjustedBaseValue =
			baseValue + yearCycle + quarterCycle + monthCycle + trend;

		// Daily volatility
		const open = adjustedBaseValue + (Math.random() - 0.5) * volatility;
		const high = open + Math.random() * volatility;
		const low = open - Math.random() * volatility;
		const close = low + Math.random() * (high - low);

		// Volume with some patterns (higher on certain days)
		const dayOfWeek = date.getDay();
		const volumeMultiplier = dayOfWeek === 1 || dayOfWeek === 5 ? 1.5 : 1; // Higher volume on Mondays and Fridays
		const volume = Math.floor((Math.random() * 5 + 3) * volumeMultiplier); // 3-8 billion

		return {
			date: date.toISOString().split("T")[0],
			open: parseFloat(open.toFixed(2)),
			high: parseFloat(high.toFixed(2)),
			low: parseFloat(low.toFixed(2)),
			close: parseFloat(close.toFixed(2)),
			volume: volume,
		};
	});
};

// Mock data for the dashboard
export const mockMarketIndices: MarketIndex[] = [
	{
		name: "S&P 500",
		value: 5248.75,
		change: 32.64,
		changePercent: 0.63,
	},
	{
		name: "Dow Jones",
		value: 39807.37,
		change: 134.21,
		changePercent: 0.34,
	},
	{
		name: "Nasdaq",
		value: 16379.92,
		change: 78.81,
		changePercent: 0.48,
	},
	{
		name: "Russell 2000",
		value: 2092.74,
		change: -5.93,
		changePercent: -0.28,
	},
];

export const mockMarketSummary: MarketSummary = {
	advancers: 2347,
	decliners: 1853,
	unchanged: 124,
	totalVolume: 4.8, // in billions
	marketTrend: "bullish",
};

// Generate historical data for each index
export const mockIndexHistoricalData = {
	"S&P 500": generateHistoricalData(5000, 50),
	"Dow Jones": generateHistoricalData(39800, 200),
	Nasdaq: generateHistoricalData(16300, 100),
	"Russell 2000": generateHistoricalData(2100, 25),
};

// Top performing stocks
export const mockTopStocks: StockData[] = [
	{
		symbol: "AAPL",
		name: "Apple Inc.",
		price: 182.52,
		change: 3.24,
		changePercent: 1.81,
		volume: 58.3,
		marketCap: 2820,
		pe: 30.2,
		sector: "Technology",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "MSFT",
		name: "Microsoft Corporation",
		price: 425.27,
		change: 7.89,
		changePercent: 1.89,
		volume: 23.7,
		marketCap: 3160,
		pe: 37.4,
		sector: "Technology",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "GOOGL",
		name: "Alphabet Inc.",
		price: 175.98,
		change: 2.13,
		changePercent: 1.23,
		volume: 19.8,
		marketCap: 2180,
		pe: 25.1,
		sector: "Technology",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "AMZN",
		name: "Amazon.com Inc.",
		price: 182.41,
		change: 3.78,
		changePercent: 2.12,
		volume: 32.5,
		marketCap: 1890,
		pe: 47.3,
		sector: "Consumer Cyclical",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "NVDA",
		name: "NVIDIA Corporation",
		price: 924.79,
		change: 23.45,
		changePercent: 2.6,
		volume: 41.2,
		marketCap: 2280,
		pe: 68.5,
		sector: "Technology",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "META",
		name: "Meta Platforms Inc.",
		price: 511.32,
		change: 8.76,
		changePercent: 1.74,
		volume: 17.9,
		marketCap: 1310,
		pe: 29.8,
		sector: "Technology",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "TSLA",
		name: "Tesla Inc.",
		price: 175.21,
		change: -3.42,
		changePercent: -1.91,
		volume: 98.7,
		marketCap: 557,
		pe: 48.2,
		sector: "Automotive",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "BRK.A",
		name: "Berkshire Hathaway Inc.",
		price: 621430.0,
		change: 4320.0,
		changePercent: 0.7,
		volume: 0.001,
		marketCap: 741,
		pe: 10.8,
		sector: "Financial Services",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "JPM",
		name: "JPMorgan Chase & Co.",
		price: 198.47,
		change: 1.23,
		changePercent: 0.62,
		volume: 8.9,
		marketCap: 572,
		pe: 12.1,
		sector: "Financial Services",
		lastUpdated: new Date().toISOString(),
	},
	{
		symbol: "V",
		name: "Visa Inc.",
		price: 278.34,
		change: 2.87,
		changePercent: 1.04,
		volume: 6.3,
		marketCap: 567,
		pe: 31.4,
		sector: "Financial Services",
		lastUpdated: new Date().toISOString(),
	},
];

// Sector performance
export const mockSectorPerformance: SectorPerformance[] = [
	{ sector: "Technology", change: 1.87 },
	{ sector: "Healthcare", change: 0.92 },
	{ sector: "Financial Services", change: 0.54 },
	{ sector: "Consumer Cyclical", change: 1.23 },
	{ sector: "Communication Services", change: 0.78 },
	{ sector: "Industrials", change: -0.32 },
	{ sector: "Energy", change: -0.87 },
	{ sector: "Utilities", change: 0.12 },
	{ sector: "Real Estate", change: -0.45 },
	{ sector: "Materials", change: 0.23 },
	{ sector: "Consumer Defensive", change: 0.67 },
];
