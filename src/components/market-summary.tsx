"use client";

import * as React from "react";
import {
  IconArrowUpRight,
  IconChartBar,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MarketDataService, formatPercent } from "@/lib/data";
import type { MarketSummary as MarketSummaryType, SectorPerformance } from "@/lib/data";

export function MarketSummary() {
  const [marketData, setMarketData] = React.useState<MarketSummaryType | null>(null);
  const [sectorData, setSectorData] = React.useState<SectorPerformance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch market summary and sector performance data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [marketSummary, sectorPerformance] = await Promise.all([
          MarketDataService.getMarketSummary(),
          MarketDataService.getSectorPerformance()
        ]);

        setMarketData(marketSummary);
        setSectorData(sectorPerformance);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading || !marketData) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="h-[400px] flex items-center justify-center">
          <p>Loading market data...</p>
        </Card>
        <Card className="h-[400px] flex items-center justify-center">
          <p>Loading sector data...</p>
        </Card>
      </div>
    );
  }

  // Calculate the percentage of advancers
  const totalStocks =
    marketData.advancers + marketData.decliners + marketData.unchanged;
  const advancersPercent = (marketData.advancers / totalStocks) * 100;
  const declinersPercent = (marketData.decliners / totalStocks) * 100;
  const unchangedPercent = (marketData.unchanged / totalStocks) * 100;

  // Sort sectors by performance
  const sortedSectors = [...sectorData].sort(
    (a, b) => b.change - a.change,
  );
  const topSectors = sortedSectors.slice(0, 5);
  const bottomSectors = [...sortedSectors].reverse().slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="h-5 w-5" />
            Market Breadth
          </CardTitle>
          <CardDescription>
            Advancers vs. decliners across all exchanges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 font-medium text-green-500">
                  <IconTrendingUp className="h-4 w-4" />
                  Advancers
                </div>
                <span>
                  {marketData.advancers.toLocaleString()} (
                  {advancersPercent.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={advancersPercent}
                className="h-2 bg-muted"
                indicatorClassName="bg-green-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 font-medium text-red-500">
                  <IconTrendingDown className="h-4 w-4" />
                  Decliners
                </div>
                <span>
                  {marketData.decliners.toLocaleString()} (
                  {declinersPercent.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={declinersPercent}
                className="h-2 bg-muted"
                indicatorClassName="bg-red-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 font-medium text-muted-foreground">
                  Unchanged
                </div>
                <span>
                  {marketData.unchanged.toLocaleString()} (
                  {unchangedPercent.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={unchangedPercent}
                className="h-2 bg-muted"
                indicatorClassName="bg-gray-500"
              />
            </div>

            <div className="pt-2 text-sm">
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-medium">
                  {marketData.totalVolume.toFixed(1)}B shares
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground">Market Trend</span>
                <span
                  className={`font-medium ${
                    marketData.marketTrend === "bullish"
                      ? "text-green-500"
                      : marketData.marketTrend === "bearish"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {marketData.marketTrend.charAt(0).toUpperCase() +
                    marketData.marketTrend.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconArrowUpRight className="h-5 w-5" />
            Sector Performance
          </CardTitle>
          <CardDescription>
            Best and worst performing sectors today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium font-me">Top Performers</h4>
              <div className="space-y-2">
                {topSectors.map(sector => (
                  <div
                    key={sector.sector}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{sector.sector}</span>
                    <span
                      className={
                        sector.change > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {formatPercent(sector.change)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="mb-2 font-medium font-me">Bottom Performers</h4>
              <div className="space-y-2">
                {bottomSectors.map(sector => (
                  <div
                    key={sector.sector}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{sector.sector}</span>
                    <span
                      className={
                        sector.change > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {formatPercent(sector.change)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
