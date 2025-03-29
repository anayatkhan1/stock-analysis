# Stock Analysis Dashboard Data Architecture

## Overview

This document describes the data architecture for the Stock Analysis Dashboard. The architecture is designed to centralize all mock data and make it easily replaceable with real API data in the future.

## Directory Structure

```
src/
├── lib/
│   └── data/
│       ├── index.ts             # Main export file
│       ├── types.ts             # Type definitions
│       ├── mock-data.ts         # Mock data storage
│       ├── market-data-service.ts # Service layer for data access
│       └── format-utils.ts      # Formatting utilities
```

## Components

### 1. Types (types.ts)

Contains all type definitions used throughout the application:
- `StockData`
- `MarketIndex`
- `MarketSummary`
- `StockHistoricalData`
- `SectorPerformance`
- `ChartDataItem`

### 2. Mock Data (mock-data.ts)

Contains all the mock data used in the application:
- Market indices
- Market summary
- Sector performance
- Top stocks
- Historical data generation functions

### 3. Data Service (market-data-service.ts)

Provides a service layer that acts as an interface between components and data sources:
- Methods to fetch different types of data
- Data transformation functions
- Utility methods for filtering and processing data

### 4. Formatting Utilities (format-utils.ts)

Contains common formatting functions used across components:
- `formatNumber`: Format numbers with commas
- `formatMarketCap`: Format market cap in billions or trillions
- `formatPercent`: Format percentages with + sign for positive values

## Usage

### In Components

Components should import and use the data service to fetch data:

```typescript
import { MarketDataService, formatNumber } from '@/lib/data';

// In a React component
const [data, setData] = useState([]);

useEffect(() => {
  async function fetchData() {
    const result = await MarketDataService.getMarketIndices();
    setData(result);
  }
  
  fetchData();
}, []);
```

## Future API Integration

To replace mock data with real API data in the future:

1. Update the methods in `MarketDataService` to make real API calls
2. Keep the same method signatures and return types
3. No changes will be needed in the components

Example of future implementation:

```typescript
// Current implementation (mock)
static async getMarketIndices(): Promise<MarketIndex[]> {
  return Promise.resolve(mockMarketIndices);
}

// Future implementation (real API)
static async getMarketIndices(): Promise<MarketIndex[]> {
  const response = await fetch('/api/market-indices');
  return response.json();
}
```

## Benefits

1. **Centralized Data Management**: All mock data is defined in one place
2. **Separation of Concerns**: Components are decoupled from data sources
3. **Easy API Integration**: Clear path to replace mock data with real API calls
4. **Consistent Formatting**: Common formatting utilities prevent code duplication
5. **Type Safety**: Strong typing throughout the data flow