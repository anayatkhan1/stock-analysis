"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardHeader>
        <CardTitle>Market Sectors</CardTitle>
        <CardDescription>
          Performance of major market sectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading sectors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card 
                key={sector.sector} 
                className="cursor-pointer hover:shadow-md transition-shadow"
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
                  <p className="text-sm text-muted-foreground">
                    Click to view stocks in this sector
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}