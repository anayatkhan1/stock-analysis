"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketDataService, formatPercent, formatNumber } from "@/lib/data";
import type {
  SectorPerformance,
  StockData,
  TechnicalIndicator,
} from "@/lib/data";
import { IconArrowRight, IconChartBar, IconFilter } from "@tabler/icons-react";

interface SectorAnalysisSheetProps {
  sectorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewAllStocks: (sectorId: string, analyzedStocks?: StockData[]) => void;
}

export function SectorAnalysisSheet({
  sectorId,
  open,
  onOpenChange,
  onViewAllStocks,
}: SectorAnalysisSheetProps) {
  const [sectorData, setSectorData] = React.useState<SectorPerformance | null>(
    null,
  );
  const [allStocksInSector, setAllStocksInSector] = React.useState<StockData[]>(
    [],
  );
  const [topStocks, setTopStocks] = React.useState<StockData[]>([]);
  const [indicators, setIndicators] = React.useState<TechnicalIndicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [hasAppliedAnalysis, setHasAppliedAnalysis] = React.useState(false);
  const [analyzedStocks, setAnalyzedStocks] = React.useState<StockData[]>([]);

  // Fetch sector data, stocks, and indicators when sectorId changes
  React.useEffect(() => {
    if (!sectorId || !open) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Get sector performance data
        const allSectors = await MarketDataService.getSectorPerformance();
        const selectedSector = allSectors.find(
          sector => sector.sector.toLowerCase() === sectorId?.toLowerCase(),
        );

        if (selectedSector) {
          setSectorData(selectedSector);
        }

        // Get all stocks for this sector
        const allStocks = await MarketDataService.getTopStocks();
        const sectorStocks = allStocks.filter(
          stock => stock.sector.toLowerCase() === sectorId?.toLowerCase(),
        );
        setAllStocksInSector(sectorStocks);

        // Sort by market cap and take top 5 for initial view
        const sortedStocks = [...sectorStocks].sort(
          (a, b) => b.marketCap - a.marketCap,
        );
        setTopStocks(sortedStocks.slice(0, 5));

        // Get technical indicators
        const indicatorsData = await MarketDataService.getTechnicalIndicators();
        setIndicators(indicatorsData);
      } catch (error) {
        console.error(`Failed to fetch data for sector ${sectorId}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // Reset analysis state when opening a new sector
    setHasAppliedAnalysis(false);
    setSelectedIndicator("");
  }, [sectorId, open]);

  const handleViewAllStocks = () => {
    if (sectorId) {
      onOpenChange(false);
      // Pass analyzed stocks if we have them, otherwise pass nothing
      onViewAllStocks(
        sectorId,
        hasAppliedAnalysis ? analyzedStocks : undefined,
      );
    }
  };

  const applyTechnicalAnalysis = () => {
    if (!selectedIndicator || allStocksInSector.length === 0) return;

    setIsAnalyzing(true);
    setHasAppliedAnalysis(false);

    // Simulate a more realistic analysis process with progressive updates
    // In a real implementation, this would be replaced with actual API calls or calculations

    // First phase - data preparation (30% progress)
    setTimeout(() => {
      // Second phase - applying technical indicator (70% progress)
      setTimeout(() => {
        // Final phase - sorting and ranking stocks
        let analyzedStocks: StockData[] = [];

        switch (selectedIndicator) {
          case "rsi": // RSI - Relative Strength Index
            // For RSI, we want to find stocks that are either oversold (low RSI, potential buy)
            // or overbought (high RSI, potential sell)
            analyzedStocks = [...allStocksInSector].sort((a, b) => {
              // Prioritize stocks with extreme price movements (potential oversold/overbought)
              const aExtreme =
                Math.abs(a.changePercent) > 5
                  ? 2
                  : Math.abs(a.changePercent) > 3
                  ? 1
                  : 0;
              const bExtreme =
                Math.abs(b.changePercent) > 5
                  ? 2
                  : Math.abs(b.changePercent) > 3
                  ? 1
                  : 0;

              // If both stocks have similar extremeness, sort by absolute change percent
              if (aExtreme === bExtreme) {
                return Math.abs(b.changePercent) - Math.abs(a.changePercent);
              }

              return bExtreme - aExtreme;
            });
            break;

          case "macd": // MACD - Moving Average Convergence Divergence
            // For MACD, we want to find stocks with strong momentum
            // Higher positive change percent indicates bullish momentum
            analyzedStocks = [...allStocksInSector].sort((a, b) => {
              // First prioritize positive momentum
              if (a.changePercent > 0 && b.changePercent <= 0) return -1;
              if (a.changePercent <= 0 && b.changePercent > 0) return 1;

              // Then sort by strength of momentum
              return Math.abs(b.changePercent) - Math.abs(a.changePercent);
            });
            break;

          case "sma": // SMA - Simple Moving Average
            // For SMA, we want to find stocks with good value (lower PE ratio)
            // but also consider their market cap for stability
            analyzedStocks = [...allStocksInSector].sort((a, b) => {
              // Calculate a score that balances PE ratio and market cap
              // Lower PE is better, higher market cap is better
              const aScore = (a.pe > 0 ? a.pe : 100) / (a.marketCap || 1);
              const bScore = (b.pe > 0 ? b.pe : 100) / (b.marketCap || 1);

              return aScore - bScore;
            });
            break;

          case "bb": // Bollinger Bands - volatility indicator
            // For Bollinger Bands, we want to find stocks with high volatility
            // but also consider their price change direction
            analyzedStocks = [...allStocksInSector].sort((a, b) => {
              // Calculate volatility score (higher absolute change with higher volume is better)
              const aVolatility =
                Math.abs(a.change) * Math.log10(a.volume || 1);
              const bVolatility =
                Math.abs(b.change) * Math.log10(b.volume || 1);

              return bVolatility - aVolatility;
            });
            break;

          case "obv": // On-Balance Volume
            // For OBV, we want to find stocks with high volume relative to their price
            // This can indicate accumulation or distribution
            analyzedStocks = [...allStocksInSector].sort((a, b) => {
              // Calculate volume/price ratio (higher is better)
              const aRatio = a.volume / (a.price || 1);
              const bRatio = b.volume / (b.price || 1);

              return bRatio - aRatio;
            });
            break;

          default:
            // Default sorting by market cap
            analyzedStocks = [...allStocksInSector].sort(
              (a, b) => b.marketCap - a.marketCap,
            );
        }

        // Store all analyzed stocks for potential view in table
        setAnalyzedStocks(analyzedStocks);
        // Take top stocks for display (show more than just 5)
        setTopStocks(analyzedStocks.slice(0, 8));
        setHasAppliedAnalysis(true);
        setIsAnalyzing(false);
      }, 1200);
    }, 800);
  };

  // Get the selected indicator details
  const selectedIndicatorDetails = React.useMemo(() => {
    return indicators.find(ind => ind.id === selectedIndicator);
  }, [selectedIndicator, indicators]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle className="capitalize">
            {sectorId} Sector Analysis
          </SheetTitle>
          <SheetDescription>
            Apply technical analysis to find top performing stocks
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading sector data...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-6">
                {sectorData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">Dividend Yield</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">
                            {formatPercent(sectorData.divYield || 0)}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            Indicated
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">Today's Change</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.change > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.change)}
                          </span>
                          <Progress
                            value={Math.abs(sectorData.change) * 50}
                            className="h-2 w-20"
                            indicatorClassName={
                              sectorData.change > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border rounded-md p-4">
                      <h3 className="text-md font-medium">Volume</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {sectorData.volume || 0}B
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          Daily Average
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Industries</h3>
                      <div className="flex flex-wrap gap-2">
                        {sectorData.industries?.map(industry => (
                          <Badge key={industry} variant="secondary">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Top Stocks</h3>
                    <Badge variant="outline" className="text-xs">
                      {sectorData?.stockCount || 0} Total
                    </Badge>
                  </div>
                  {topStocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No stocks found for this sector.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {topStocks.slice(0, 5).map(stock => (
                        <div
                          key={stock.symbol}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{stock.symbol}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {stock.name}
                              </p>
                            </div>
                            <span
                              className={
                                stock.changePercent > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Price:{" "}
                              </span>
                              <span>${formatNumber(stock.price)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Market Cap:{" "}
                              </span>
                              <span>${stock.marketCap}B</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-4 space-y-6">
                {sectorData && sectorData.performance && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">Today's Change</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.change > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.change)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">1 Week</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.performance.week1 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.week1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">1 Month</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.performance.month1 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.month1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">3 Months</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.performance.month3 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.month3)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">6 Months</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.performance.month6 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.month6)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">YTD</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold ${
                              sectorData.performance.ytd > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.ytd)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">1 Year</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xl font-bold ${
                              sectorData.performance.year1 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.year1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">5 Years</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xl font-bold ${
                              sectorData.performance.year5 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.year5)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border rounded-md p-4">
                        <h3 className="text-md font-medium">10 Years</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xl font-bold ${
                              sectorData.performance.year10 > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercent(sectorData.performance.year10)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border rounded-md p-4">
                      <h3 className="text-md font-medium">All Time</h3>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-2xl font-bold ${
                            sectorData.performance.allTime > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatPercent(sectorData.performance.allTime)}
                        </span>
                        <Progress
                          value={Math.min(
                            100,
                            Math.abs(sectorData.performance.allTime) / 20,
                          )}
                          className="h-2 w-32"
                          indicatorClassName={
                            sectorData.performance.allTime > 0
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="mt-4 space-y-6">
                {sectorData && sectorData.analysis ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Technical Indicators
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Current technical analysis for the {sectorData.sector}{" "}
                        sector
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* RSI */}
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">
                            Relative Strength Index (RSI)
                          </h4>
                          <Badge
                            variant={
                              sectorData.analysis.rsi > 70
                                ? "destructive"
                                : sectorData.analysis.rsi < 30
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {sectorData.analysis.rsi > 70
                              ? "Overbought"
                              : sectorData.analysis.rsi < 30
                              ? "Oversold"
                              : "Neutral"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold">
                            {sectorData.analysis.rsi.toFixed(1)}
                          </span>
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full w-full relative">
                              <div className="absolute inset-y-0 left-0 w-[30%] bg-red-500 rounded-full"></div>
                              <div className="absolute inset-y-0 left-[70%] right-0 bg-red-500 rounded-full"></div>
                              <div
                                className="absolute inset-y-0 h-4 w-1 bg-primary -top-1 rounded-full"
                                style={{ left: `${sectorData.analysis.rsi}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0</span>
                              <span>30</span>
                              <span>70</span>
                              <span>100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MACD */}
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">MACD</h4>
                          <Badge
                            variant={
                              sectorData.analysis.macd.value >
                              sectorData.analysis.macd.signal
                                ? "default"
                                : "destructive"
                            }
                          >
                            {sectorData.analysis.macd.value >
                            sectorData.analysis.macd.signal
                              ? "Bullish"
                              : "Bearish"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              MACD Line
                            </div>
                            <div
                              className={`text-lg font-medium ${
                                sectorData.analysis.macd.value > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {sectorData.analysis.macd.value.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Signal Line
                            </div>
                            <div
                              className={`text-lg font-medium ${
                                sectorData.analysis.macd.signal > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {sectorData.analysis.macd.signal.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Histogram
                            </div>
                            <div
                              className={`text-lg font-medium ${
                                sectorData.analysis.macd.histogram > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {sectorData.analysis.macd.histogram.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Moving Averages */}
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Moving Averages</h4>
                          <Badge
                            variant={
                              sectorData.analysis.sma.sma20 >
                              sectorData.analysis.sma.sma50
                                ? "default"
                                : "destructive"
                            }
                          >
                            {sectorData.analysis.sma.sma20 >
                            sectorData.analysis.sma.sma50
                              ? "Uptrend"
                              : "Downtrend"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              SMA 20
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.sma.sma20.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              SMA 50
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.sma.sma50.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              SMA 200
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.sma.sma200.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bollinger Bands */}
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Bollinger Bands</h4>
                          <Badge variant="outline">
                            Volatility:{" "}
                            {Math.round(
                              ((sectorData.analysis.bb.upper -
                                sectorData.analysis.bb.lower) /
                                sectorData.analysis.bb.middle) *
                                100,
                            )}
                            %
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Upper Band
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.bb.upper.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Middle Band
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.bb.middle.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Lower Band
                            </div>
                            <div className="text-lg font-medium">
                              {sectorData.analysis.bb.lower.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">
                            Apply Technical Indicator to Stocks
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Select a technical indicator to analyze stocks in
                            this sector
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {allStocksInSector.length} stocks
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <div className="w-full">
                          <Select
                            value={selectedIndicator}
                            onValueChange={setSelectedIndicator}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select indicator" />
                            </SelectTrigger>
                            <SelectContent>
                              {indicators.map(indicator => (
                                <SelectItem
                                  key={indicator.id}
                                  value={indicator.id}
                                >
                                  {indicator.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {selectedIndicatorDetails && (
                        <div className="rounded-md bg-muted p-4 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-base">
                              {selectedIndicatorDetails.name}
                            </p>
                            <Badge variant="outline" className="capitalize">
                              {selectedIndicatorDetails.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {selectedIndicatorDetails.description}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Best for:{" "}
                              </span>
                              {selectedIndicatorDetails.type === "momentum" &&
                                "Identifying overbought/oversold conditions"}
                              {selectedIndicatorDetails.type === "trend" &&
                                "Following market direction"}
                              {selectedIndicatorDetails.type === "volatility" &&
                                "Measuring price fluctuations"}
                              {selectedIndicatorDetails.type === "volume" &&
                                "Tracking trading activity"}
                            </div>
                            <Button
                              onClick={applyTechnicalAnalysis}
                              disabled={!selectedIndicator || isAnalyzing}
                              className="flex items-center gap-2"
                            >
                              {isAnalyzing ? "Analyzing..." : "Apply Analysis"}
                              {!isAnalyzing && (
                                <IconFilter className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {isAnalyzing && (
                        <div className="py-8 space-y-4">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm font-medium mb-3">
                              Analyzing {allStocksInSector.length} stocks with{" "}
                              {selectedIndicatorDetails?.name}
                            </p>
                            <Progress value={65} className="w-full h-2" />
                          </div>
                        </div>
                      )}

                      {hasAppliedAnalysis && !isAnalyzing && (
                        <>
                          <Separator />

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium">
                                  Analysis Results
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Stocks ranked by{" "}
                                  {selectedIndicatorDetails?.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {selectedIndicatorDetails?.type || "analysis"}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={handleViewAllStocks}
                                >
                                  View All
                                  <IconArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1">
                              {topStocks.map((stock, index) => (
                                <div
                                  key={stock.symbol}
                                  className="border rounded-md p-4 hover:border-primary transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-medium">
                                        {index + 1}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-medium">
                                            {stock.symbol}
                                          </h4>
                                          <Badge
                                            variant={
                                              stock.changePercent > 0
                                                ? "default"
                                                : "destructive"
                                            }
                                            className="text-xs"
                                          >
                                            {formatPercent(stock.changePercent)}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {stock.name}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">
                                        ${formatNumber(stock.price)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Market Cap: ${stock.marketCap}B
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-3 text-xs">
                                    <div>
                                      <div className="text-muted-foreground mb-1">
                                        Volume
                                      </div>
                                      <div className="font-medium">
                                        {stock.volume}M
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">
                                        P/E Ratio
                                      </div>
                                      <div className="font-medium">
                                        {stock.pe.toFixed(2)}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">
                                        Last Updated
                                      </div>
                                      <div className="font-medium">
                                        {new Date(
                                          stock.lastUpdated,
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 pt-3 border-t">
                                    {selectedIndicator === "rsi" && (
                                      <>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          RSI Indicator
                                        </div>
                                        <div className="h-2 bg-muted rounded-full w-full relative">
                                          <div
                                            className={`absolute h-full rounded-full ${
                                              Math.abs(stock.changePercent) > 5
                                                ? "bg-red-500"
                                                : "bg-green-500"
                                            }`}
                                            style={{
                                              width: `${Math.min(
                                                Math.abs(stock.changePercent) *
                                                  10,
                                                100,
                                              )}%`,
                                            }}
                                          />
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                          <span>Oversold</span>
                                          <span>Neutral</span>
                                          <span>Overbought</span>
                                        </div>
                                      </>
                                    )}

                                    {selectedIndicator === "macd" && (
                                      <>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Momentum Strength
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 bg-muted rounded-full w-full relative">
                                            <div
                                              className={`absolute h-full rounded-full ${
                                                stock.changePercent > 0
                                                  ? "bg-green-500"
                                                  : "bg-red-500"
                                              }`}
                                              style={{
                                                width: `${Math.min(
                                                  Math.abs(
                                                    stock.changePercent,
                                                  ) * 15,
                                                  100,
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <Badge
                                            variant={
                                              stock.changePercent > 0
                                                ? "default"
                                                : "destructive"
                                            }
                                            className="text-xs"
                                          >
                                            {stock.changePercent > 0
                                              ? "Bullish"
                                              : "Bearish"}
                                          </Badge>
                                        </div>
                                      </>
                                    )}

                                    {selectedIndicator === "sma" && (
                                      <>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Value Rating
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 bg-muted rounded-full w-full relative">
                                            <div
                                              className="absolute h-full rounded-full bg-blue-500"
                                              style={{
                                                width: `${Math.max(
                                                  100 - (stock.pe / 30) * 100,
                                                  0,
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs font-medium">
                                            P/E: {stock.pe.toFixed(1)}
                                          </span>
                                        </div>
                                      </>
                                    )}

                                    {selectedIndicator === "bb" && (
                                      <>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Volatility
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 bg-muted rounded-full w-full relative">
                                            <div
                                              className="absolute h-full rounded-full bg-purple-500"
                                              style={{
                                                width: `${Math.min(
                                                  Math.abs(stock.change) * 50,
                                                  100,
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs font-medium">
                                            ${Math.abs(stock.change).toFixed(2)}
                                          </span>
                                        </div>
                                      </>
                                    )}

                                    {selectedIndicator === "obv" && (
                                      <>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Volume Analysis
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 bg-muted rounded-full w-full relative">
                                            <div
                                              className="absolute h-full rounded-full bg-amber-500"
                                              style={{
                                                width: `${Math.min(
                                                  (stock.volume / 100) * 100,
                                                  100,
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs font-medium">
                                            {stock.volume}M
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-center pt-2">
                              <Button
                                variant="outline"
                                onClick={handleViewAllStocks}
                                className="flex items-center gap-2"
                              >
                                View All {analyzedStocks.length} Stocks
                                <IconChartBar className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <IconFilter className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      Technical Analysis Not Available
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Technical analysis data is not available for this sector.
                      Try selecting a different sector or check back later.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <SheetFooter className="mt-6">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleViewAllStocks}
              >
                <IconChartBar className="h-4 w-4" />
                {hasAppliedAnalysis
                  ? `View All ${analyzedStocks.length} Analyzed Stocks`
                  : `View All ${sectorId} Stocks`}
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
