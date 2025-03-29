"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { SectionCards } from "@/components/section-cards";
import { StockTable } from "@/components/stock-table";
import { GlobalMarketIndices } from "@/components/global-market-indices";
import { GlobalMarketHeatmap } from "@/components/global-market-heatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconWorldSearch, IconCurrencyDollar, IconChartCandle } from "@tabler/icons-react";

export default function GlobalMarketsPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("S&P 500");
  const [activeTab, setActiveTab] = React.useState<string>("overview");

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="px-4 lg:px-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Global Markets</h1>
                <p className="text-muted-foreground">
                  Track major indices, currencies, and commodities from markets around the world
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4 lg:px-6"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <IconWorldSearch className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="indices" className="flex items-center gap-2">
              <IconChartCandle className="h-4 w-4" />
              <span>Indices</span>
            </TabsTrigger>
            <TabsTrigger value="currencies" className="flex items-center gap-2">
              <IconCurrencyDollar className="h-4 w-4" />
              <span>Currencies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SectionCards onSelectIndex={handleSelectIndex} />

            <div className="grid grid-cols-1 gap-6">
              <ChartAreaInteractive selectedIndex={selectedIndex} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlobalMarketHeatmap />
                <MarketSummary />
              </div>

              <StockTable />
            </div>
          </TabsContent>

          <TabsContent value="indices" className="space-y-6">
            <GlobalMarketIndices />
          </TabsContent>

          <TabsContent value="currencies" className="space-y-6">
            <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
              <CardHeader>
                <CardTitle>Global Currencies</CardTitle>
                <CardDescription>
                  Major currency pairs and exchange rates
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p>Currency data will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}