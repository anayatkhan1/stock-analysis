"use client";

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
import { marketSummary, sectorPerformance } from "@/app/app/stock-data";
import { Progress } from "@/components/ui/progress";

export function MarketSummary() {
  // Calculate the percentage of advancers
  const totalStocks =
    marketSummary.advancers + marketSummary.decliners + marketSummary.unchanged;
  const advancersPercent = (marketSummary.advancers / totalStocks) * 100;
  const declinersPercent = (marketSummary.decliners / totalStocks) * 100;
  const unchangedPercent = (marketSummary.unchanged / totalStocks) * 100;

  // Sort sectors by performance
  const sortedSectors = [...sectorPerformance].sort(
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
                  {marketSummary.advancers.toLocaleString()} (
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
                  {marketSummary.decliners.toLocaleString()} (
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
                  {marketSummary.unchanged.toLocaleString()} (
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
                  {marketSummary.totalVolume.toFixed(1)}B shares
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground">Market Trend</span>
                <span
                  className={`font-medium ${
                    marketSummary.marketTrend === "bullish"
                      ? "text-green-500"
                      : marketSummary.marketTrend === "bearish"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {marketSummary.marketTrend.charAt(0).toUpperCase() +
                    marketSummary.marketTrend.slice(1)}
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
                      {sector.change > 0 ? "+" : ""}
                      {sector.change.toFixed(2)}%
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
                      {sector.change > 0 ? "+" : ""}
                      {sector.change.toFixed(2)}%
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
