"use client";

import { TechnicalAnalysis } from "@/components/technical-analysis";

export default function StockScannerPage() {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stock Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Scan and analyze stocks across different sectors using advanced
          technical indicators
        </p>
      </div>

      <TechnicalAnalysis showHeader={true} />
    </div>
  );
}
