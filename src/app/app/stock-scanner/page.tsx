"use client";

import { TechnicalAnalysis } from "@/components/technical-analysis";
import { IconChartBar } from "@tabler/icons-react";

export default function StockScannerPage() {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <IconChartBar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock Scanner</h1>
            <p className="text-muted-foreground mt-1">
              Analyze market sectors and discover investment opportunities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-4 py-2 rounded-md w-full sm:w-auto">
          <span className="font-medium">Pro Tip:</span>
          <span className="text-muted-foreground">
            Select a sector to apply technical indicators and find
            top-performing stocks
          </span>
        </div>
      </div>

      <TechnicalAnalysis showHeader={true} />
    </div>
  );
}
