"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorsList } from "@/components/sectors-list";
import { SectorAnalysisSheet } from "@/components/sector-analysis-sheet";
import { SectorStocksPage } from "./sector-stocks-page";
import { MarketDataService } from "@/lib/data";
import type { TechnicalIndicator } from "@/lib/data";

interface TechnicalAnalysisProps {
  showHeader?: boolean;
}

export function TechnicalAnalysis({
  showHeader = false,
}: TechnicalAnalysisProps) {
  const [selectedSectorId, setSelectedSectorId] = React.useState<string | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [viewingSectorStocks, setViewingSectorStocks] = React.useState(false);
  const [viewingSectorId, setViewingSectorId] = React.useState<string | null>(
    null,
  );
  const [indicators, setIndicators] = React.useState<TechnicalIndicator[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch technical indicators
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const indicatorsData = await MarketDataService.getTechnicalIndicators();
        setIndicators(indicatorsData);
      } catch (error) {
        console.error("Failed to fetch technical indicators:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSelectSector = (sectorId: string) => {
    setSelectedSectorId(sectorId);
    setSheetOpen(true);
  };

  const handleViewAllStocks = (sectorId: string) => {
    setViewingSectorId(sectorId);
    setViewingSectorStocks(true);
  };

  const handleBackToSectors = () => {
    setViewingSectorStocks(false);
    setViewingSectorId(null);
  };

  // Group indicators by type
  const indicatorsByType = React.useMemo(() => {
    const grouped: Record<string, TechnicalIndicator[]> = {
      momentum: [],
      trend: [],
      volatility: [],
      volume: [],
    };

    indicators.forEach(indicator => {
      if (grouped[indicator.type]) {
        grouped[indicator.type].push(indicator);
      }
    });

    return grouped;
  }, [indicators]);

  return (
    <div className="space-y-6">
      {showHeader && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Analysis Tools</CardTitle>
            <CardDescription>
              Our stock scanner uses advanced technical indicators to identify
              trading opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="momentum" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.keys(indicatorsByType).map(type => (
                  <TabsTrigger key={type} value={type} className="capitalize">
                    {type} Indicators
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(indicatorsByType).map(
                ([type, typeIndicators]) => (
                  <TabsContent key={type} value={type} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {typeIndicators.map(indicator => (
                        <Card key={indicator.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {indicator.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {indicator.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ),
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {viewingSectorStocks && viewingSectorId ? (
        <SectorStocksPage
          sectorId={viewingSectorId}
          onBack={handleBackToSectors}
        />
      ) : (
        <SectorsList onSelectSector={handleSelectSector} />
      )}

      <SectorAnalysisSheet
        sectorId={selectedSectorId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onViewAllStocks={handleViewAllStocks}
      />
    </div>
  );
}
