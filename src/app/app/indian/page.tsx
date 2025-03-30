"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { StockTable } from "@/components/stock-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IconChartPie,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import {
  MarketDataService,
  formatNumber,
  formatPercent,
  MarketIndex,
  SectorPerformance
} from "@/lib/data";

export default function IndianMarketsPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("NIFTY 50");
  const [indices, setIndices] = React.useState<MarketIndex[]>([]);
  const [sectorPerformance, setSectorPerformance] = React.useState<SectorPerformance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch market indices data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const marketIndices = await MarketDataService.getIndianMarketIndices();
        setIndices(marketIndices);

        const sectorData = await MarketDataService.getIndianSectorPerformance();
        setSectorPerformance(sectorData);
      } catch (error) {
        console.error("Failed to fetch Indian market data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  // Calculate progress values for sector performance
  const getProgressValue = (change: number) => {
    // Convert percentage to a 0-100 scale for the progress bar
    const absChange = Math.abs(change);
    // Max change we expect is around 2%, so scale accordingly
    return Math.min(Math.round(absChange * 50), 100);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="px-4 lg:px-6">
          <Card className="bg-background">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Indian Markets
                </h1>
                <p className="text-muted-foreground">
                  Track BSE and NSE indices, stocks, and market trends in the
                  Indian stock market
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          {/* Market Index Cards */}
          {isLoading ? (
            <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="h-[180px] flex items-center justify-center">
                  <p>Loading market data...</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
              {indices.map(index => (
                <Card
                  key={index.name}
                  className="@container/card cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleSelectIndex(index.name)}
                >
                  <CardHeader>
                    <CardDescription>{index.name === "NIFTY 50" || index.name === "BANK NIFTY" || index.name === "NIFTY IT" ? "NSE" : "BSE"}</CardDescription>
                    <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
                      {formatNumber(index.value)}
                    </CardTitle>
                    <CardAction>
                      <Badge
                        variant="outline"
                        className={index.changePercent > 0 ? "text-green-500" : "text-red-500"}
                      >
                        {index.changePercent > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                        {formatPercent(index.changePercent)}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {index.change > 0 ? (
                        <>
                          Up {formatNumber(index.change)} points{" "}
                          <IconTrendingUp className="size-4 text-green-500" />
                        </>
                      ) : (
                        <>
                          Down {formatNumber(Math.abs(index.change))} points{" "}
                          <IconTrendingDown className="size-4 text-red-500" />
                        </>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {index.name}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <ChartAreaInteractive selectedIndex={selectedIndex} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sectoral Performance Card */}
              <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconChartPie className="h-5 w-5" />
                    Sectoral Performance
                  </CardTitle>
                  <CardDescription>
                    NSE sectoral indices performance today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <p>Loading sector data...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sectorPerformance.map(sector => (
                        <div key={sector.sector} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="font-medium">{sector.sector}</div>
                            <span className={sector.change > 0 ? "text-green-500" : "text-red-500"}>
                              {formatPercent(sector.change)}
                            </span>
                          </div>
                          <Progress
                            value={getProgressValue(sector.change)}
                            className="h-2 bg-muted"
                            indicatorClassName={sector.change > 0 ? "bg-green-500" : "bg-red-500"}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <MarketSummary />
            </div>

            <StockTable />
          </div>
        </div>
      </div>
    </>
  );
}
