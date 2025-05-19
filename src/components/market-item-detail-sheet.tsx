"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconCalendar,
  IconChartLine,
  IconTrendingDown,
  IconTrendingUp,
  IconWorld,
  IconCoin,
  IconCurrencyDollar,
  IconBuildingBank,
  IconInfoCircle,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartBar,
  IconChartCandle,
  IconMaximize,
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartDataItem, MarketDataService, formatPercent } from "@/lib/data";
import { MarketItem } from "@/lib/data/types";

interface MarketItemDetailSheetProps {
  item: MarketItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const chartConfig = {
  price: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MarketItemDetailSheet({
  item,
  open,
  onOpenChange,
}: MarketItemDetailSheetProps) {
  const router = useRouter();
  const [timeRange, setTimeRange] = React.useState("3m");
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [filteredData, setFilteredData] = React.useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to navigate to full chart view
  const navigateToFullChart = () => {
    if (item) {
      // Create a URL-friendly version of the stock name
      const stockNameSlug = item.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/app/global/${stockNameSlug}/chart`);
    }
  };

  // Fetch historical data for the market item
  React.useEffect(() => {
    async function fetchData() {
      if (!item) return;

      setIsLoading(true);
      try {
        const historicalData = await MarketDataService.getIndexHistoricalData(
          item.name,
        );
        const formattedData = MarketDataService.formatChartData(historicalData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch market item historical data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (open && item) {
      fetchData();
    }
  }, [item, open]);

  // Filter data by time range
  React.useEffect(() => {
    const filtered = MarketDataService.filterDataByTimeRange(
      chartData,
      timeRange as "1m" | "3m" | "6m" | "1y" | "5y",
    );
    setFilteredData(filtered);
  }, [timeRange, chartData]);

  if (!item) return null;

  const isPositive1D = item.change1D > 0;
  const chartChange = MarketDataService.calculateChange(filteredData);
  const chartIsPositive = parseFloat(chartChange.percent as string) >= 0;

  // Get icon based on market item type
  const getTypeIcon = () => {
    switch (item.type) {
      case "index":
        return <IconWorld className="size-5" />;
      case "commodity":
        return <IconCoin className="size-5" />;
      case "currency":
        return <IconCurrencyDollar className="size-5" />;
      case "bond":
        return <IconBuildingBank className="size-5" />;
      default:
        return <IconChartLine className="size-5" />;
    }
  };

  // Get type label
  const getTypeLabel = () => {
    switch (item.type) {
      case "index":
        return "Market Index";
      case "commodity":
        return "Commodity";
      case "currency":
        return "Currency";
      case "bond":
        return "Bond";
      default:
        return "Asset";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-5">
        <SheetHeader className="px-1 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="font-bold text-2xl">
                {item.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1">
                {getTypeIcon()} {getTypeLabel()}
                {item.country && ` • ${item.country}`}
              </SheetDescription>
            </div>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${
                isPositive1D ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive1D ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
              {formatPercent(item.change1D)}
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
                <p className="text-muted-foreground text-sm">Current Value</p>
                <p className="font-medium text-2xl">
                  {item.value.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">1 Day Change</p>
                <div className="flex items-center gap-1 justify-end">
                  {isPositive1D ? (
                    <IconArrowUpRight className="size-4 text-green-500" />
                  ) : (
                    <IconArrowDownRight className="size-4 text-red-500" />
                  )}
                  <p
                    className={`font-medium text-lg ${
                      isPositive1D ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatPercent(item.change1D)}
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
                    {item.change1W > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        item.change1W > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(item.change1W)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1 Month</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.change1M > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        item.change1M > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(item.change1M)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">3 Months</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.change3M > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        item.change3M > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(item.change3M)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">6 Months</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.change6M > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        item.change6M > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(item.change6M)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1 Year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.change1Y > 0 ? (
                      <IconArrowUpRight className="size-4 text-green-500" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        item.change1Y > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(item.change1Y)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <IconCalendar className="size-4" />
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
                {item.country && (
                  <div className="flex items-center gap-1">
                    <IconWorld className="size-4" />
                    <span>{item.country}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChartLine className="size-5" />
                <h3 className="font-medium">Price History</h3>
              </div>
              <div className="flex items-center gap-2">
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
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={navigateToFullChart}
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
                        id="fillMarketItemPrice"
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
                      fill="url(#fillMarketItemPrice)"
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
                    {Math.abs(parseFloat(chartChange.percent as string)) > 5 ? (
                      <Badge
                        variant={chartIsPositive ? "default" : "destructive"}
                      >
                        Strong
                      </Badge>
                    ) : Math.abs(parseFloat(chartChange.percent as string)) >
                      2 ? (
                      <Badge
                        variant={chartIsPositive ? "default" : "destructive"}
                      >
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
                    {item.type === "commodity" || item.type === "currency" ? (
                      <Badge variant="outline">High</Badge>
                    ) : item.type === "bond" ? (
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
                          item.change1D > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                      <span>Short-term Momentum</span>
                    </div>
                    <Badge
                      variant={
                        item.change1D > 0 && item.change1W > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {item.change1D > 0 && item.change1W > 0
                        ? "Bullish"
                        : "Bearish"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <IconChartLine
                        className={`size-4 ${
                          item.change1M > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                      <span>Medium-term Trend</span>
                    </div>
                    <Badge
                      variant={
                        item.change1M > 0 && item.change3M > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {item.change1M > 0 && item.change3M > 0
                        ? "Bullish"
                        : "Bearish"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <IconChartCandle
                        className={`size-4 ${
                          item.change6M > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                      <span>Long-term Outlook</span>
                    </div>
                    <Badge
                      variant={
                        item.change6M > 0 && item.change1Y > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {item.change6M > 0 && item.change1Y > 0
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
                <h3 className="font-medium">Market Insights</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {item.type === "index" &&
                  `${
                    item.name
                  } is a stock market index that measures the performance of ${
                    item.country || "global"
                  } stocks.`}
                {item.type === "commodity" &&
                  `${item.name} is a commodity traded globally and influenced by supply, demand, and geopolitical factors.`}
                {item.type === "bond" &&
                  `${item.name} represents debt securities with fixed interest payments and principal repayment at maturity.`}
                {item.type === "currency" &&
                  `${item.name} is a currency pair showing the exchange rate between two national currencies.`}
              </p>
              <p className="text-sm">
                {chartIsPositive
                  ? `The ${timeRange} trend shows positive momentum with a ${chartChange.percent}% increase.`
                  : `The ${timeRange} trend shows negative pressure with a ${chartChange.percent}% decrease.`}{" "}
                {item.change1D > 0 && item.change1W > 0 && item.change1M > 0
                  ? "Short, medium, and long-term indicators all suggest bullish sentiment."
                  : item.change1D < 0 && item.change1W < 0 && item.change1M < 0
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
