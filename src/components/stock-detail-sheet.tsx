"use client";

import * as React from "react";
import {
  IconCalendar,
  IconChartLine,
  IconTrendingDown,
  IconTrendingUp,
  IconInfoCircle,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartBar,
  IconChartCandle,
  IconMaximize,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartDataItem,
  MarketDataService,
  StockData,
  formatMarketCap,
  formatNumber,
  formatPercent,
} from "@/lib/data";

interface StockDetailSheetProps {
  stock: StockData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Volume (M)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function StockDetailSheet({
  stock,
  open,
  onOpenChange,
}: StockDetailSheetProps) {
  const router = useRouter();
  const [timeRange, setTimeRange] = React.useState("3m");
  const [stockData, setStockData] = React.useState<ChartDataItem[]>([]);
  const [filteredData, setFilteredData] = React.useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Only calculate isPositive if stock exists
  const isPositive = stock ? stock.changePercent > 0 : false;

  // Fetch historical data for the stock
  React.useEffect(() => {
    async function fetchData() {
      if (!stock) return;

      setIsLoading(true);
      try {
        const historicalData = await MarketDataService.getStockHistoricalData(
          stock,
        );
        const formattedData = MarketDataService.formatChartData(
          historicalData,
        ).map(item => ({
          ...item,
          volume: item.volume * (stock.volume / 10), // Scale volume based on stock's volume
        }));
        setStockData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock historical data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [stock]);

  // Filter data by time range
  React.useEffect(() => {
    const filtered = MarketDataService.filterDataByTimeRange(
      stockData,
      timeRange as "1m" | "3m" | "6m" | "1y" | "5y",
    );
    setFilteredData(filtered);
  }, [timeRange, stockData]);

  // Calculate chart change only if we have data
  const chartChange =
    filteredData.length > 0
      ? MarketDataService.calculateChange(filteredData)
      : { value: 0, percent: "0.00" };
  const chartIsPositive = parseFloat(chartChange.percent as string) >= 0;

  // Function to navigate to full chart view
  const handleViewFullChart = () => {
    if (!stock) return;

    // Create a URL-friendly version of the stock name
    const stockNameSlug = stock.name.toLowerCase().replace(/\s+/g, "-");

    // Navigate to the full chart page
    router.push(`/app/indian/${stockNameSlug}/chart`);

    // Close the sheet
    onOpenChange(false);
  };

  // If stock is null, render nothing or a placeholder
  if (!stock) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-5">
          <SheetHeader className="px-1 pb-4">
            <SheetTitle>No stock selected</SheetTitle>
            <SheetDescription>
              Please select a stock to view details
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  // Simulate weekly, monthly, and quarterly changes based on daily change
  // In a real app, these would come from the API
  const simulatedChanges = {
    week1: stock.changePercent * (Math.random() * 2 + 3), // 3-5x daily change
    month1: stock.changePercent * (Math.random() * 3 + 5), // 5-8x daily change
    month3: stock.changePercent * (Math.random() * 5 + 8), // 8-13x daily change
    month6: stock.changePercent * (Math.random() * 8 + 10), // 10-18x daily change
    year1: stock.changePercent * (Math.random() * 10 + 15), // 15-25x daily change
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md  md:max-w-lg lg:max-w-xl overflow-y-auto p-5">
        <SheetHeader className="px-1 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="font-bold text-2xl">
                {stock.symbol}
              </SheetTitle>
              <SheetDescription>{stock.name}</SheetDescription>
            </div>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
              {formatPercent(stock.changePercent)}
            </Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6 px-1">
            <div className="flex items-center justify-between p-4 rounded-md border bg-muted/30">
              <div>
                <p className="text-muted-foreground text-sm">Current Price</p>
                <p className="font-medium text-2xl">
                  ₹{stock.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">1 Day Change</p>
                <div className="flex items-center gap-1 justify-end">
                  {isPositive ? (
                    <IconArrowUpRight className="size-4 text-green-500" />
                  ) : (
                    <IconArrowDownRight className="size-4 text-red-500" />
                  )}
                  <p
                    className={`font-medium text-lg ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatPercent(stock.changePercent)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconChartLine className="size-5" />
                <h3 className="font-semibold">Performance</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1 Week</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {simulatedChanges.week1 > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        simulatedChanges.week1 > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(simulatedChanges.week1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1 Month</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {simulatedChanges.month1 > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        simulatedChanges.month1 > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(simulatedChanges.month1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">3 Months</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {simulatedChanges.month3 > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        simulatedChanges.month3 > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(simulatedChanges.month3)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">6 Months</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {simulatedChanges.month6 > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        simulatedChanges.month6 > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(simulatedChanges.month6)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1 Year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {simulatedChanges.year1 > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        simulatedChanges.year1 > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(simulatedChanges.year1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Company Information</h3>
              <div className="rounded-md border p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Market Cap</p>
                    <p className="font-medium">
                      {formatMarketCap(stock.marketCap)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">P/E Ratio</p>
                    <p className="font-medium">{stock.pe.toFixed(1)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Volume</p>
                    <p className="font-medium">{formatNumber(stock.volume)}M</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Sector</p>
                    <p className="font-medium">{stock.sector}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                <span>
                  Last Updated:{" "}
                  {new Date(stock.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChartLine className="size-5" />
                <h3 className="font-medium">Price History</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${
                    chartIsPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {chartIsPositive ? (
                    <IconTrendingUp className="size-4" />
                  ) : (
                    <IconTrendingDown className="size-4" />
                  )}
                  {chartIsPositive ? "+" : ""}
                  {chartChange.percent}%
                </Badge>
                <Button
                  onClick={handleViewFullChart}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <IconMaximize className="size-4" />
                  <span>Full Chart</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="flex"
              >
                <ToggleGroupItem value="1m" className="h-8 px-2.5">
                  1M
                </ToggleGroupItem>
                <ToggleGroupItem value="3m" className="h-8 px-2.5">
                  3M
                </ToggleGroupItem>
                <ToggleGroupItem value="6m" className="h-8 px-2.5">
                  6M
                </ToggleGroupItem>
                <ToggleGroupItem value="1y" className="h-8 px-2.5">
                  1Y
                </ToggleGroupItem>
                <ToggleGroupItem value="5y" className="h-8 px-2.5">
                  5Y
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-full w-full"
                >
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient
                        id="fillStockPrice"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={
                            chartIsPositive
                              ? "rgba(34, 197, 94, 0.8)"
                              : "rgba(239, 68, 68, 0.8)"
                          }
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={
                            chartIsPositive
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(239, 68, 68, 0.1)"
                          }
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={value => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={value => value.toLocaleString()}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={value => {
                            return new Date(value).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            });
                          }}
                          indicator="dot"
                          formatter={(value: any) => {
                            return typeof value === "number"
                              ? value.toLocaleString()
                              : value;
                          }}
                        />
                      }
                    />
                    <Area
                      dataKey="price"
                      type="monotone"
                      fill="url(#fillStockPrice)"
                      stroke={
                        chartIsPositive
                          ? "rgba(34, 197, 94, 1)"
                          : "rgba(239, 68, 68, 1)"
                      }
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChartBar className="size-5" />
                <h3 className="font-medium">Technical Analysis</h3>
              </div>
            </div>

            <div className="rounded-md border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Trend Strength
                  </p>
                  <div className="flex items-center gap-2">
                    {Math.abs(stock.changePercent) > 3 ? (
                      <Badge variant={isPositive ? "default" : "destructive"}>
                        Strong
                      </Badge>
                    ) : Math.abs(stock.changePercent) > 1 ? (
                      <Badge variant={isPositive ? "default" : "destructive"}>
                        Moderate
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Weak</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Volatility</p>
                  <div className="flex items-center gap-2">
                    {stock.volume > 10 ? (
                      <Badge variant="outline">High</Badge>
                    ) : stock.volume < 5 ? (
                      <Badge variant="outline">Low</Badge>
                    ) : (
                      <Badge variant="outline">Medium</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Performance Indicators
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <IconArrowUpRight
                        className={`size-4 ${
                          stock.changePercent > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span>Short-term Momentum</span>
                    </div>
                    <Badge
                      variant={
                        stock.changePercent > 0 && simulatedChanges.week1 > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {stock.changePercent > 0 && simulatedChanges.week1 > 0
                        ? "Bullish"
                        : "Bearish"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <IconChartLine
                        className={`size-4 ${
                          simulatedChanges.month1 > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span>Medium-term Trend</span>
                    </div>
                    <Badge
                      variant={
                        simulatedChanges.month1 > 0 &&
                        simulatedChanges.month3 > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {simulatedChanges.month1 > 0 &&
                      simulatedChanges.month3 > 0
                        ? "Bullish"
                        : "Bearish"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <IconChartCandle
                        className={`size-4 ${
                          simulatedChanges.month6 > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span>Long-term Outlook</span>
                    </div>
                    <Badge
                      variant={
                        simulatedChanges.month6 > 0 &&
                        simulatedChanges.year1 > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {simulatedChanges.month6 > 0 && simulatedChanges.year1 > 0
                        ? "Bullish"
                        : "Bearish"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-5">
              <div className="flex items-center gap-2 mb-4">
                <IconInfoCircle className="size-5 text-muted-foreground" />
                <h3 className="font-medium">Stock Insights</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {stock.name} is a {stock.sector} company listed on the Indian
                stock market. With a market cap of{" "}
                {formatMarketCap(stock.marketCap)} and P/E ratio of{" "}
                {stock.pe.toFixed(1)}, it{" "}
                {stock.pe < 15
                  ? "may be considered undervalued compared to industry peers"
                  : stock.pe > 30
                  ? "trades at a premium compared to industry peers"
                  : "is trading at a valuation in line with industry peers"}
                .
              </p>
              <p className="text-sm">
                {chartIsPositive
                  ? `The ${timeRange} trend shows positive momentum with a ${chartChange.percent}% increase.`
                  : `The ${timeRange} trend shows negative pressure with a ${chartChange.percent}% decrease.`}{" "}
                {simulatedChanges.week1 > 0 &&
                simulatedChanges.month1 > 0 &&
                simulatedChanges.month3 > 0
                  ? "Short, medium, and long-term indicators all suggest bullish sentiment."
                  : simulatedChanges.week1 < 0 &&
                    simulatedChanges.month1 < 0 &&
                    simulatedChanges.month3 < 0
                  ? "Short, medium, and long-term indicators all suggest bearish sentiment."
                  : "Mixed signals across different timeframes suggest market uncertainty."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
