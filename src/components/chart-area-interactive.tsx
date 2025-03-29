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
import { indexHistoricalData } from "@/app/app/stock-data";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp } from "@tabler/icons-react";

// Define the chart data type
interface ChartDataItem {
  date: string;
  price: number;
  volume: number;
}

// Format the historical data for the chart
const formatChartData = (indexName: string): ChartDataItem[] => {
  const data =
    indexHistoricalData[indexName as keyof typeof indexHistoricalData] ||
    indexHistoricalData["S&P 500"];
  return data.map(item => ({
    date: item.date,
    price: item.close,
    volume: item.volume,
  }));
};

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


const calculateChange = (data: ChartDataItem[]) => {
  if (data.length < 2) return { value: 0, percent: 0 };

  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const change = lastPrice - firstPrice;
  const percentChange = (change / firstPrice) * 100;

  return {
    value: change.toFixed(2),
    percent: percentChange.toFixed(2),
  };
};

interface ChartAreaInteractiveProps {
  selectedIndex?: string;
}

export function ChartAreaInteractive({
  selectedIndex,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [indexName, setIndexName] = React.useState(selectedIndex || "S&P 500");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    if (selectedIndex) {
      setIndexName(selectedIndex);
    }
  }, [selectedIndex]);

  const chartData = React.useMemo(
    () => formatChartData(indexName),
    [indexName],
  );

  const filteredData = React.useMemo(() => {
    return chartData.filter(item => {
      const date = new Date(item.date);
      const referenceDate = new Date();
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timeRange, chartData]);

  const change = calculateChange(filteredData);
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
            {timeRange === "90d"
              ? "3 month"
              : timeRange === "30d"
              ? "1 month"
              : "1 week"}{" "}
            price movement
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" ? "3M" : timeRange === "30d" ? "1M" : "1W"}{" "}
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
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              1 Month
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              1 Week
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
              <SelectItem value="90d" className="rounded-lg">
                3 Months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                1 Month
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                1 Week
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
      </CardContent>
    </Card>
  );
}
