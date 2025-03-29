"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GlobalMarketHeatmap() {
  const [view, setView] = React.useState("sectors");
  
  return (
    <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Market Heatmap</CardTitle>
          <CardDescription>
            Visual representation of market performance
          </CardDescription>
        </div>
        <Select value={view} onValueChange={setView}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sectors">By Sectors</SelectItem>
            <SelectItem value="regions">By Regions</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {view === "sectors" ? (
          <div className="grid grid-cols-4 gap-2">
            {/* Technology - Strong positive */}
            <div className="bg-green-600 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Technology</div>
              <div className="text-lg font-bold">+2.4%</div>
            </div>
            
            {/* Healthcare - Moderate positive */}
            <div className="bg-green-500 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Healthcare</div>
              <div className="text-lg font-bold">+1.8%</div>
            </div>
            
            {/* Consumer Discretionary - Light positive */}
            <div className="bg-green-400 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Consumer Disc.</div>
              <div className="text-lg font-bold">+1.2%</div>
            </div>
            
            {/* Communication - Very light positive */}
            <div className="bg-green-300 text-green-900 p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Communication</div>
              <div className="text-lg font-bold">+0.7%</div>
            </div>
            
            {/* Industrials - Neutral positive */}
            <div className="bg-green-200 text-green-900 p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Industrials</div>
              <div className="text-lg font-bold">+0.3%</div>
            </div>
            
            {/* Utilities - Neutral */}
            <div className="bg-gray-200 text-gray-900 p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Utilities</div>
              <div className="text-lg font-bold">0.0%</div>
            </div>
            
            {/* Real Estate - Light negative */}
            <div className="bg-red-300 text-red-900 p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Real Estate</div>
              <div className="text-lg font-bold">-0.5%</div>
            </div>
            
            {/* Materials - Moderate negative */}
            <div className="bg-red-400 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Materials</div>
              <div className="text-lg font-bold">-0.9%</div>
            </div>
            
            {/* Energy - Strong negative */}
            <div className="bg-red-500 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Energy</div>
              <div className="text-lg font-bold">-1.3%</div>
            </div>
            
            {/* Financials - Very strong negative */}
            <div className="bg-red-600 text-white p-3 rounded-md flex flex-col justify-between h-24">
              <div className="text-xs font-medium">Financials</div>
              <div className="text-lg font-bold">-1.8%</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {/* North America - Strong positive */}
            <div className="bg-green-600 text-white p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">North America</div>
              <div className="text-lg font-bold">+1.5%</div>
            </div>
            
            {/* Europe - Moderate positive */}
            <div className="bg-green-400 text-white p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">Europe</div>
              <div className="text-lg font-bold">+0.8%</div>
            </div>
            
            {/* Japan - Light positive */}
            <div className="bg-green-300 text-green-900 p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">Japan</div>
              <div className="text-lg font-bold">+0.4%</div>
            </div>
            
            {/* Australia - Neutral */}
            <div className="bg-gray-200 text-gray-900 p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">Australia</div>
              <div className="text-lg font-bold">+0.1%</div>
            </div>
            
            {/* China - Moderate negative */}
            <div className="bg-red-400 text-white p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">China</div>
              <div className="text-lg font-bold">-0.7%</div>
            </div>
            
            {/* Emerging Markets - Strong negative */}
            <div className="bg-red-600 text-white p-3 rounded-md flex flex-col justify-between h-32">
              <div className="text-xs font-medium">Emerging Markets</div>
              <div className="text-lg font-bold">-1.2%</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}