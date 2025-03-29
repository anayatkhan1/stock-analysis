"use client";

import * as React from "react";
import {
  IconCalendar,
  IconChartLine,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartDataItem, MarketDataService, StockData, formatMarketCap, formatNumber, formatPercent } from "@/lib/data";

interface StockDetailSheetProps {
  stock: StockData;
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
  const [timeRange, setTimeRange] = React.useState("3m");
  const [stockData, setStockData] = React.useState<ChartDataItem[]>([]);
  const [filteredData, setFilteredData] = React.useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const isPositive = stock.changePercent > 0;

  // Fetch historical data for the stock
  React.useEffect(() => {
    async function fetchData() {
      if (!stock) return;

      setIsLoading(true);
      try {
        const historicalData = await MarketDataService.getStockHistoricalData(stock);
        const formattedData = MarketDataService.formatChartData(historicalData).map(item => ({
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
      timeRange as '1m' | '3m' | '6m' | '1y' | '5y'
    );
    setFilteredData(filtered);
  }, [timeRange, stockData]);

  const chartChange = MarketDataService.calculateChange(filteredData);
  const chartIsPositive = parseFloat(chartChange.percent as string) >= 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-5">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6 px-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Price</p>
                <p className="font-medium text-xl">${stock.price}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Change</p>
                <p
                  className={`font-met-medimedium ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ${stock.change.toFixed(2)} (
                  {formatPercent(stock.changePercent)})
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Market Cap</p>
                <p className="">{formatMarketCap(stock.marketCap)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">P/E Ratio</p>
                <p>{stock.pe.toFixed(1)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Additional Information</h3>
              <div className="rounded-md border p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Volume</p>
                    <p className="font-medium">{formatNumber(stock.volume)}M</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Sector</p>
                    <p className="">{stock.sector}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-sm">
                      Last Updated
                    </p>
                    <p className="flex items-center gap-1">
                      <IconCalendar className="size-4 text-muted-foreground" />
                      {new Date(stock.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChartLine className="size-5" />
                <h3 className="font-medium">Price History</h3>
              </div>
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
