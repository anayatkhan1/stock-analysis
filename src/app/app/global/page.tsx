"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { SectionCards } from "@/components/section-cards";
import { StockTable } from "@/components/stock-table";
import { GlobalMarketHeatmap } from "@/components/global-market-heatmap";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalMarketsPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("S&P 500");

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="px-4 lg:px-6">
          <Card className="bg-background">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Global Markets
                </h1>
                <p className="text-muted-foreground">
                  Track major indices and commodities from markets around the
                  world
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          <SectionCards onSelectIndex={handleSelectIndex} />

          <div className="grid grid-cols-1 gap-6">
            <ChartAreaInteractive selectedIndex={selectedIndex} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlobalMarketHeatmap />
              <MarketSummary />
            </div>

            <StockTable />
          </div>
        </div>
      </div>
    </>
  );
}
