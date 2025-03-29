"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { SectionCards } from "@/components/section-cards";
import { StockTable } from "@/components/stock-table";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("S&P 500");

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  return (
    <>
      <div className="space-y-6">
        <SectionCards onSelectIndex={handleSelectIndex} />

        <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
          <ChartAreaInteractive selectedIndex={selectedIndex} />

          <MarketSummary />

          <StockTable />
        </div>
      </div>
    </>
  );
}
