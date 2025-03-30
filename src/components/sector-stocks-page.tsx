"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconChartLine,
  IconInfoCircle,
} from "@tabler/icons-react";
import { MarketDataService, formatPercent, formatNumber } from "@/lib/data";
import type { StockData, TechnicalIndicator } from "@/lib/data";

interface SectorStocksPageProps {
  sectorId: string;
  onBack: () => void;
  analyzedStocks?: StockData[];
}

type SortField = "symbol" | "name" | "price" | "changePercent" | "volume" | "marketCap" | "pe";
type SortDirection = "asc" | "desc";

export function SectorStocksPage({ sectorId, onBack, analyzedStocks }: SectorStocksPageProps) {
  const [stocks, setStocks] = React.useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = React.useState<StockData[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [indicators, setIndicators] = React.useState<TechnicalIndicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = React.useState<string>("");
  const [sortField, setSortField] = React.useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [hasAnalyzedData, setHasAnalyzedData] = React.useState(false);

  // Fetch stocks and indicators for the selected sector
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // If we have analyzed stocks, use them
        if (analyzedStocks && analyzedStocks.length > 0) {
          setStocks(analyzedStocks);
          setFilteredStocks(analyzedStocks);
          setHasAnalyzedData(true);
        } else {
          // Otherwise fetch all stocks for this sector
          const allStocks = await MarketDataService.getTopStocks();
          const sectorStocks = allStocks.filter(
            stock => stock.sector.toLowerCase() === sectorId.toLowerCase()
          );
          setStocks(sectorStocks);
          setFilteredStocks(sectorStocks);
        }

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
  }, [sectorId, analyzedStocks]);

  // Handle search and filtering
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStocks(sortStocks(stocks, sortField, sortDirection));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = stocks.filter(
        stock =>
          stock.symbol.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query)
      );
      setFilteredStocks(sortStocks(filtered, sortField, sortDirection));
    }
  }, [searchQuery, stocks, sortField, sortDirection]);

  // Sort stocks based on field and direction
  const sortStocks = (stocksToSort: StockData[], field: SortField, direction: SortDirection) => {
    return [...stocksToSort].sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "changePercent":
          comparison = a.changePercent - b.changePercent;
          break;
        case "volume":
          comparison = a.volume - b.volume;
          break;
        case "marketCap":
          comparison = a.marketCap - b.marketCap;
          break;
        case "pe":
          comparison = a.pe - b.pe;
          break;
        default:
          comparison = 0;
      }

      return direction === "asc" ? comparison : -comparison;
    });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new field
    }
  };

  // Apply technical analysis to stocks
  const applyTechnicalAnalysis = () => {
    if (!selectedIndicator || stocks.length === 0) return;

    setIsAnalyzing(true);

    // Simulate analysis with a delay to show loading state
    setTimeout(() => {
      // In a real implementation, this would apply the actual technical indicator algorithm
      // For now, we'll simulate results by sorting stocks differently based on the indicator
      let analyzedStocks: StockData[] = [];

      switch (selectedIndicator) {
        case "rsi": // RSI - sort by price change (oversold/overbought)
          analyzedStocks = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
          break;
        case "macd": // MACD - sort by recent momentum (price change)
          analyzedStocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
          break;
        case "sma": // SMA - sort by stability (lower PE ratio)
          analyzedStocks = [...stocks].sort((a, b) => a.pe - b.pe);
          break;
        case "bb": // Bollinger Bands - sort by volatility (higher change)
          analyzedStocks = [...stocks].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
          break;
        case "obv": // On-Balance Volume - sort by volume
          analyzedStocks = [...stocks].sort((a, b) => b.volume - a.volume);
          break;
        default:
          analyzedStocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap);
      }

      setFilteredStocks(analyzedStocks);
      setIsAnalyzing(false);
    }, 1200); // Simulate analysis taking time
  };

  // Get the selected indicator details
  const selectedIndicatorDetails = React.useMemo(() => {
    return indicators.find(ind => ind.id === selectedIndicator);
  }, [selectedIndicator, indicators]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="capitalize">
                {hasAnalyzedData ? `${sectorId} Stocks (Analyzed)` : `${sectorId} Stocks`}
              </CardTitle>
              <CardDescription>
                {hasAnalyzedData
                  ? `Analyzed stocks in the ${sectorId} sector based on technical indicators`
                  : `Analysis and comparison of stocks in the ${sectorId} sector`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all-stocks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-stocks">All Stocks</TabsTrigger>
              <TabsTrigger value="technical-analysis">Technical Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="all-stocks" className="mt-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="relative w-full sm:w-auto flex-1">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by symbol or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={sortField} onValueChange={(value) => handleSort(value as SortField)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">Symbol</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="changePercent">% Change</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="marketCap">Market Cap</SelectItem>
                      <SelectItem value="pe">P/E Ratio</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  >
                    {sortDirection === "asc" ? (
                      <IconSortAscending className="h-4 w-4" />
                    ) : (
                      <IconSortDescending className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p>Loading stocks...</p>
                </div>
              ) : filteredStocks.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p>No stocks found for this sector.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Symbol</th>
                        <th className="h-10 px-4 text-left font-medium">Name</th>
                        <th className="h-10 px-4 text-right font-medium">Price</th>
                        <th className="h-10 px-4 text-right font-medium">Change</th>
                        <th className="h-10 px-4 text-right font-medium">Volume</th>
                        <th className="h-10 px-4 text-right font-medium">Market Cap</th>
                        <th className="h-10 px-4 text-right font-medium">P/E</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks.map((stock, index) => (
                        <tr
                          key={stock.symbol}
                          className={`border-b transition-colors hover:bg-muted/50 ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                          }`}
                        >
                          <td className="p-4 font-medium">{stock.symbol}</td>
                          <td className="p-4 max-w-[200px] truncate">{stock.name}</td>
                          <td className="p-4 text-right">${formatNumber(stock.price)}</td>
                          <td className={`p-4 text-right ${
                            stock.changePercent > 0 ? "text-green-500" : "text-red-500"
                          }`}>
                            {formatPercent(stock.changePercent)}
                          </td>
                          <td className="p-4 text-right">{stock.volume}M</td>
                          <td className="p-4 text-right">${stock.marketCap}B</td>
                          <td className="p-4 text-right">{stock.pe}</td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <IconChartLine className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="technical-analysis" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Apply Technical Indicator</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a technical indicator to analyze and rank stocks in this sector
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:w-auto flex-1">
                    <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        {indicators.map(indicator => (
                          <SelectItem key={indicator.id} value={indicator.id}>
                            {indicator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={applyTechnicalAnalysis}
                    disabled={!selectedIndicator || isAnalyzing}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    {isAnalyzing ? "Analyzing..." : "Apply Analysis"}
                    {!isAnalyzing && <IconFilter className="h-4 w-4" />}
                  </Button>
                </div>

                {selectedIndicatorDetails && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{selectedIndicatorDetails.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {selectedIndicatorDetails.type} indicator
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedIndicatorDetails.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p>Analyzing stocks using {selectedIndicatorDetails?.name}...</p>
                  </div>
                ) : selectedIndicator && filteredStocks.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Analysis Results</h3>
                      <Badge variant="outline">
                        {filteredStocks.length} stocks
                      </Badge>
                    </div>

                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-10 px-4 text-left font-medium">Rank</th>
                            <th className="h-10 px-4 text-left font-medium">Symbol</th>
                            <th className="h-10 px-4 text-left font-medium">Name</th>
                            <th className="h-10 px-4 text-right font-medium">Price</th>
                            <th className="h-10 px-4 text-right font-medium">Change</th>
                            <th className="h-10 px-4 text-right font-medium">Volume</th>
                            <th className="h-10 px-4 text-right font-medium">Market Cap</th>
                            <th className="h-10 px-4 text-right font-medium">P/E</th>
                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStocks.map((stock, index) => (
                            <tr
                              key={stock.symbol}
                              className={`border-b transition-colors hover:bg-muted/50 ${
                                index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                              }`}
                            >
                              <td className="p-4">
                                <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                                  {index + 1}
                                </Badge>
                              </td>
                              <td className="p-4 font-medium">{stock.symbol}</td>
                              <td className="p-4 max-w-[200px] truncate">{stock.name}</td>
                              <td className="p-4 text-right">${formatNumber(stock.price)}</td>
                              <td className={`p-4 text-right ${
                                stock.changePercent > 0 ? "text-green-500" : "text-red-500"
                              }`}>
                                {formatPercent(stock.changePercent)}
                              </td>
                              <td className="p-4 text-right">{stock.volume}M</td>
                              <td className="p-4 text-right">${stock.marketCap}B</td>
                              <td className="p-4 text-right">{stock.pe}</td>
                              <td className="p-4 text-right">
                                <Button variant="ghost" size="sm">
                                  <IconChartLine className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
