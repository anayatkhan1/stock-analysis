"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp } from "@tabler/icons-react";
import { ChartDataItem, MarketDataService } from "@/lib/data";

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Volume (B)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  selectedIndex?: string;
}

export function ChartAreaInteractive({
  selectedIndex,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("3m");
  const [indexName, setIndexName] = React.useState(selectedIndex || "S&P 500");
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [filteredData, setFilteredData] = React.useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch historical data when index changes
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const historicalData = await MarketDataService.getIndexHistoricalData(indexName);
        const formattedData = MarketDataService.formatChartData(historicalData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch index data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [indexName]);

  // Filter data by time range
  React.useEffect(() => {
    const filtered = MarketDataService.filterDataByTimeRange(
      chartData,
      timeRange as '1m' | '3m' | '6m' | '1y' | '5y'
    );
    setFilteredData(filtered);
  }, [timeRange, chartData]);

  // Set mobile-friendly time range
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1m");
    }
  }, [isMobile]);

  // Update index name when selected from parent
  React.useEffect(() => {
    if (selectedIndex) {
      setIndexName(selectedIndex);
    }
  }, [selectedIndex]);

  const change = MarketDataService.calculateChange(filteredData);
  const isPositive = parseFloat(change.percent as string) >= 0;

  return (
    <Card className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <CardTitle>{indexName}</CardTitle>
          <Badge
            variant="outline"
            className={isPositive ? "text-green-500" : "text-red-500"}
          >
            <IconTrendingUp className={!isPositive ? "rotate-180" : ""} />
            {isPositive ? "+" : ""}
            {change.percent}%
          </Badge>
        </div>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {timeRange === "5y"
              ? "5 year"
              : timeRange === "1y"
              ? "1 year"
              : timeRange === "6m"
              ? "6 month"
              : timeRange === "3m"
              ? "3 month"
              : "1 month"}{" "}
            price movement
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "5y"
              ? "5Y"
              : timeRange === "1y"
              ? "1Y"
              : timeRange === "6m"
              ? "6M"
              : timeRange === "3m"
              ? "3M"
              : "1M"}{" "}
            movement
          </span>
        </CardDescription>
        <div className="absolute top-4 right-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40"
              aria-label="Select time range"
            >
              <SelectValue placeholder="3 Months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1m" className="rounded-lg">
                1 Month
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                3 Months
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                6 Months
              </SelectItem>
              <SelectItem value="1y" className="rounded-lg">
                1 Year
              </SelectItem>
              <SelectItem value="5y" className="rounded-lg">
                5 Years
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[350px]">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={
                      isPositive
                        ? "rgba(34, 197, 94, 0.8)"
                        : "rgba(239, 68, 68, 0.8)"
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      isPositive
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
                fill="url(#fillPrice)"
                stroke={
                  isPositive ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)"
                }
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
