"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectorsList } from "@/components/sectors-list";
import { SectorAnalysisSheet } from "@/components/sector-analysis-sheet";
import { SectorStocksPage } from "./sector-stocks-page";
import type { StockData } from "@/lib/data";

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
  const [analyzedStocksData, setAnalyzedStocksData] = React.useState<StockData[]>([]);

  const handleSelectSector = (sectorId: string) => {
    setSelectedSectorId(sectorId);
    setSheetOpen(true);
  };

  const handleViewAllStocks = (sectorId: string, analyzedStocks?: StockData[]) => {
    setViewingSectorId(sectorId);
    setViewingSectorStocks(true);
    // Store analyzed stocks if provided
    if (analyzedStocks) {
      setAnalyzedStocksData(analyzedStocks);
    } else {
      setAnalyzedStocksData([]);
    }
  };

  const handleBackToSectors = () => {
    setViewingSectorStocks(false);
    setViewingSectorId(null);
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <Card className="bg-gradient-to-r from-muted/50 to-background border">
          <CardHeader>
            <CardTitle>Market Sector Analysis</CardTitle>
            <CardDescription>
              Discover high-potential stocks using technical analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">How it works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  1. Select a sector from the list below<br />
                  2. Apply technical indicators to analyze stocks<br />
                  3. View top-performing stocks based on your analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewingSectorStocks && viewingSectorId ? (
        <SectorStocksPage
          sectorId={viewingSectorId}
          onBack={handleBackToSectors}
          analyzedStocks={analyzedStocksData.length > 0 ? analyzedStocksData : undefined}
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
