"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  IconChartLine,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDataItem, MarketDataService, StockData } from "@/lib/data";
import { useRouter } from "next/navigation";

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

export default function StockChartPage() {
  const router = useRouter();
  const params = useParams();
  const stockName = params.stockName as string;

  // Convert slug back to readable name
  const readableStockName = stockName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [timeRange, setTimeRange] = useState("3m");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stock data first
  useEffect(() => {
    async function fetchStockData() {
      setIsLoading(true);
      try {
        // Get stock data by symbol or name
        const stock = await MarketDataService.getStockBySymbolOrName(
          readableStockName,
        );
        if (stock) {
          setStockData(stock);
        }
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    }

    fetchStockData();
  }, [readableStockName]);

  // Fetch historical data for the stock
  useEffect(() => {
    async function fetchData() {
      if (!stockData) return;

      try {
        const historicalData = await MarketDataService.getStockHistoricalData(
          stockData,
        );
        const formattedData = MarketDataService.formatChartData(
          historicalData,
        ).map(item => ({
          ...item,
          volume: item.volume * (stockData.volume / 10), // Scale volume based on stock's volume
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock historical data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (stockData) {
      fetchData();
    }
  }, [stockData]);

  // Filter data by time range
  useEffect(() => {
    const filtered = MarketDataService.filterDataByTimeRange(
      chartData,
      timeRange as "1m" | "3m" | "6m" | "1y" | "5y",
    );
    setFilteredData(filtered);
  }, [timeRange, chartData]);

  // Calculate chart change only if we have data
  const chartChange =
    filteredData.length > 0
      ? MarketDataService.calculateChange(filteredData)
      : { value: 0, percent: "0.00" };
  const chartIsPositive = parseFloat(chartChange.percent as string) >= 0;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <IconArrowLeft className="size-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold">
          {stockData ? stockData.symbol : readableStockName} Chart
        </h1>
        {stockData && (
          <Badge variant="outline" className="ml-2">
            {stockData.name}
          </Badge>
        )}
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconChartLine className="size-5" />
            <h2 className="text-xl font-medium">Price History</h2>
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

        <div className="h-[600px] w-full">
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

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span>Data source: Market Data Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
