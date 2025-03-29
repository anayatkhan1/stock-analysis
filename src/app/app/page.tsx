"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { SectionCards } from "@/components/section-cards";
import { StockTable } from "@/components/stock-table";
import { TechnicalAnalysis } from "@/components/technical-analysis";
import { IconArrowRight, IconChartBar } from "@tabler/icons-react";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("S&P 500");

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  return (
    <>
      <div className="space-y-6">
        <SectionCards onSelectIndex={handleSelectIndex} />

        <Tabs defaultValue="market-overview" className="px-4 lg:px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market-overview">Market Overview</TabsTrigger>
            <TabsTrigger value="technical-analysis">
              Technical Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market-overview" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <ChartAreaInteractive selectedIndex={selectedIndex} />
              <MarketSummary />
              <StockTable />
            </div>
          </TabsContent>

          <TabsContent value="technical-analysis" className="mt-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Technical Analysis Preview
                </h2>
                <p className="text-muted-foreground">
                  Analyze market sectors using technical indicators
                </p>
              </div>
              <Button asChild>
                <Link href="/app/stock-scanner" className="flex items-center">
                  <IconChartBar className="mr-2 h-4 w-4" />
                  Open Stock Scanner
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <TechnicalAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
