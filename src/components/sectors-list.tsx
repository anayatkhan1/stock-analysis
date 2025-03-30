"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketDataService, formatPercent } from "@/lib/data";
import type { SectorPerformance } from "@/lib/data";

interface SectorsListProps {
  onSelectSector: (sectorId: string) => void;
}

export function SectorsList({ onSelectSector }: SectorsListProps) {
  const [sectors, setSectors] = React.useState<SectorPerformance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch sector performance data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const sectorData = await MarketDataService.getSectorPerformance();
        setSectors(sectorData);
      } catch (error) {
        console.error("Failed to fetch sector performance:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Sectors</CardTitle>
            <CardDescription>Performance of major market sectors</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-xs">Bullish</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="text-xs">Bearish</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading sectors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map(sector => (
              <Card
                key={sector.sector}
                className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                  sector.change > 0 ? "border-l-green-500" : "border-l-red-500"
                }`}
                onClick={() => onSelectSector(sector.sector)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{sector.sector}</CardTitle>
                    <span
                      className={`text-sm font-medium ${
                        sector.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPercent(sector.change)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Click to analyze stocks
                    </p>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {sector.change > 0 ? "Bullish" : "Bearish"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
