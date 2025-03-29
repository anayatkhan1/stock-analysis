"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { MarketDataService, formatPercent } from "@/lib/data";
import type { SectorPerformance, StockData } from "@/lib/data";

interface SectorAnalysisSheetProps {
  sectorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewAllStocks: (sectorId: string) => void;
}

export function SectorAnalysisSheet({
  sectorId,
  open,
  onOpenChange,
  onViewAllStocks,
}: SectorAnalysisSheetProps) {
  const [sectorData, setSectorData] = React.useState<SectorPerformance | null>(
    null,
  );
  const [topStocks, setTopStocks] = React.useState<StockData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch sector data and top stocks when sectorId changes
  React.useEffect(() => {
    if (!sectorId || !open) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Get sector performance data
        const allSectors = await MarketDataService.getSectorPerformance();
        const selectedSector = allSectors.find(
          sector => sector.sector.toLowerCase() === sectorId?.toLowerCase(),
        );

        if (selectedSector) {
          setSectorData(selectedSector);
        }

        // Get top stocks for this sector
        const allStocks = await MarketDataService.getTopStocks();
        const sectorStocks = allStocks.filter(
          stock => stock.sector.toLowerCase() === sectorId?.toLowerCase(),
        );

        // Sort by market cap and take top 5
        const sortedStocks = sectorStocks.sort(
          (a, b) => b.marketCap - a.marketCap,
        );
        setTopStocks(sortedStocks.slice(0, 5));
      } catch (error) {
        console.error(`Failed to fetch data for sector ${sectorId}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [sectorId, open]);

  const handleViewAllStocks = () => {
    if (sectorId) {
      onOpenChange(false);
      onViewAllStocks(sectorId);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="capitalize">
            {sectorId} Sector Analysis
          </SheetTitle>
          <SheetDescription>
            Performance analysis and top stocks in this sector
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading sector data...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {sectorData && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Performance</h3>
                <div className="flex items-center justify-between">
                  <span>Today's Change</span>
                  <span
                    className={
                      sectorData.change > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {formatPercent(sectorData.change)}
                  </span>
                </div>
                <Progress
                  value={Math.abs(sectorData.change) * 50}
                  className="h-2"
                  indicatorClassName={
                    sectorData.change > 0 ? "bg-green-500" : "bg-red-500"
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Top Stocks</h3>
              {topStocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No stocks found for this sector.
                </p>
              ) : (
                <div className="space-y-4">
                  {topStocks.map(stock => (
                    <div key={stock.symbol} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{stock.symbol}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {stock.name}
                          </p>
                        </div>
                        <span
                          className={
                            stock.changePercent > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {formatPercent(stock.changePercent)}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span>${stock.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Market Cap:{" "}
                          </span>
                          <span>${stock.marketCap}B</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button className="w-full" onClick={handleViewAllStocks}>
              View All {sectorId} Stocks
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
