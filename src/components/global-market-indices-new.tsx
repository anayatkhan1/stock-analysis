"use client";

import * as React from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconSearch,
  IconWorldSearch,
  IconMapPin,
  IconChartBar,
  IconChartLine,
  IconChartCandle,
  IconCalendarStats,
  IconArrowsSort,
  IconChartPie
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { globalMarketIndices } from "@/data/mock-data";

type MarketIndex = {
  name: string;
  description: string;
  value: string;
  change: string;
  isPositive: boolean;
  country: string;
};

type SortOption = "name" | "value" | "change" | "country";
type SortDirection = "asc" | "desc";

export function GlobalMarketIndices() {
  const [region, setRegion] = React.useState("americas");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [viewMode, setViewMode] = React.useState<"grouped" | "list">("grouped");

  const getIndicesByRegion = (region: string): MarketIndex[] => {
    switch (region) {
      case "americas":
        return globalMarketIndices.americas;
      case "europe":
        return globalMarketIndices.europe;
      case "asia":
        return globalMarketIndices.asia;
      default:
        return globalMarketIndices.americas;
    }
  };

  const groupIndicesByCountry = (indices: MarketIndex[]): Record<string, MarketIndex[]> => {
    const grouped: Record<string, MarketIndex[]> = {};
    
    indices.forEach(index => {
      if (!grouped[index.country]) {
        grouped[index.country] = [];
      }
      grouped[index.country].push(index);
    });
    
    return grouped;
  };

  const filterIndices = (indices: MarketIndex[]): MarketIndex[] => {
    if (!searchQuery) return indices;
    
    const query = searchQuery.toLowerCase();
    return indices.filter(
      index => 
        index.name.toLowerCase().includes(query) || 
        index.description.toLowerCase().includes(query) ||
        index.country.toLowerCase().includes(query)
    );
  };

  const sortIndices = (indices: MarketIndex[]): MarketIndex[] => {
    return [...indices].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "value":
          comparison = parseFloat(a.value.replace(/,/g, "")) - parseFloat(b.value.replace(/,/g, ""));
          break;
        case "change":
          const aChange = parseFloat(a.change.replace("%", "").replace(/[+\-]/g, ""));
          const bChange = parseFloat(b.change.replace("%", "").replace(/[+\-]/g, ""));
          comparison = a.isPositive === b.isPositive 
            ? aChange - bChange 
            : a.isPositive ? 1 : -1;
          break;
        case "country":
          comparison = a.country.localeCompare(b.country);
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const getProcessedIndices = (): MarketIndex[] => {
    const indices = getIndicesByRegion(region);
    const filtered = filterIndices(indices);
    return sortIndices(filtered);
  };

  // Reusable index item component
  const IndexItem = ({ index }: { index: MarketIndex }) => (
    <div className="flex items-center justify-between hover:bg-muted/30 p-3 rounded-md transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col">
          <div className="font-medium">{index.name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <IconMapPin className="h-3 w-3" />
            {index.description} ({index.country})
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{index.value}</div>
        <Badge variant={index.isPositive ? "outline" : "destructive"} className={index.isPositive ? "text-green-500 border-green-200" : "bg-red-500/10 text-red-500 border-red-200"}>
          {index.isPositive ? (
            <IconTrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <IconTrendingDown className="h-3 w-3 mr-1" />
          )}
          {index.change}
        </Badge>
      </div>
    </div>
  );

  // Reusable region section component
  const RegionSection = ({ title, indices }: { title: string; indices: MarketIndex[] }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="secondary" className="text-xs">{indices.length}</Badge>
      </div>
      <div className="space-y-1 bg-muted/20 rounded-lg p-2">
        {indices.map((index, i) => (
          <IndexItem key={i} index={index} />
        ))}
      </div>
    </div>
  );

  const renderGroupedIndices = (region: string) => {
    const indices = getProcessedIndices();
    
    if (indices.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          No indices match your search criteria
        </div>
      );
    }

    // Region-specific groupings
    if (region === "americas" && viewMode === "grouped") {
      const usIndices = indices.filter(index => index.country === "United States");
      const otherIndices = indices.filter(index => index.country !== "United States");
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegionSection title="United States" indices={usIndices} />
          <RegionSection title="Canada & Latin America" indices={otherIndices} />
        </div>
      );
    }

    if (region === "europe" && viewMode === "grouped") {
      const westernEurope = ["United Kingdom", "Germany", "France", "Spain"];
      const westernIndices = indices.filter(index => westernEurope.includes(index.country));
      const otherIndices = indices.filter(index => !westernEurope.includes(index.country));
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegionSection title="Western Europe" indices={westernIndices} />
          <RegionSection title="Other European Markets" indices={otherIndices} />
        </div>
      );
    }

    if (region === "asia" && viewMode === "grouped") {
      const eastAsia = ["Japan", "China", "Hong Kong", "South Korea"];
      const eastAsiaIndices = indices.filter(index => eastAsia.includes(index.country));
      const asiaPacificIndices = indices.filter(index => !eastAsia.includes(index.country));
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegionSection title="East Asia" indices={eastAsiaIndices} />
          <RegionSection title="Asia-Pacific" indices={asiaPacificIndices} />
        </div>
      );
    }

    // List view for all regions
    return (
      <div className="space-y-1 bg-muted/20 rounded-lg p-2">
        {indices.map((index, i) => (
          <IndexItem key={i} index={index} />
        ))}
      </div>
    );
  };

  // Performance summary for the selected region
  const getPerformanceSummary = (region: string) => {
    const indices = getIndicesByRegion(region);
    const positiveCount = indices.filter(index => index.isPositive).length;
    const negativeCount = indices.length - positiveCount;
    const positivePercentage = Math.round((positiveCount / indices.length) * 100);
    
    let overallSentiment = "neutral";
    if (positivePercentage > 65) overallSentiment = "bullish";
    else if (positivePercentage < 35) overallSentiment = "bearish";
    
    return {
      total: indices.length,
      positive: positiveCount,
      negative: negativeCount,
      positivePercentage,
      overallSentiment
    };
  };

  const renderPerformanceSummary = (region: string) => {
    const summary = getPerformanceSummary(region);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconWorldSearch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Indices</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">
                Tracked markets in this region
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Advancing</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{summary.positive}</div>
              <div className="text-sm text-muted-foreground">
                {summary.positivePercentage}% of indices are up
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Declining</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{summary.negative}</div>
              <div className="text-sm text-muted-foreground">
                {100 - summary.positivePercentage}% of indices are down
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`
          ${summary.overallSentiment === 'bullish' ? 'bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20' : 
            summary.overallSentiment === 'bearish' ? 'bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20' : 
            'bg-gradient-to-br from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20'} 
          border-0
        `}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChartBar className={`h-5 w-5 
                  ${summary.overallSentiment === 'bullish' ? 'text-green-600 dark:text-green-400' : 
                    summary.overallSentiment === 'bearish' ? 'text-red-600 dark:text-red-400' : 
                    'text-yellow-600 dark:text-yellow-400'}`} 
                />
                <span className={`text-sm font-medium 
                  ${summary.overallSentiment === 'bullish' ? 'text-green-600 dark:text-green-400' : 
                    summary.overallSentiment === 'bearish' ? 'text-red-600 dark:text-red-400' : 
                    'text-yellow-600 dark:text-yellow-400'}`}>
                  Market Sentiment
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold capitalize">{summary.overallSentiment}</div>
              <div className="text-sm text-muted-foreground">
                Overall market direction
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Global Market Indices</CardTitle>
                <CardDescription>
                  Major stock market indices from around the world
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === "grouped" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("grouped")}
                >
                  <IconWorldSearch className="h-4 w-4 mr-1" />
                  Grouped
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <IconChartCandle className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
            <Tabs value={region} onValueChange={setRegion} className="mt-2">
              <TabsList>
                <TabsTrigger value="americas">Americas</TabsTrigger>
                <TabsTrigger value="europe">Europe</TabsTrigger>
                <TabsTrigger value="asia">Asia-Pacific</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {renderPerformanceSummary(region)}
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="relative w-full md:w-64">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search indices..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="change">Change</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  <IconArrowsSort className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""} transition-transform`} />
                </Button>
              </div>
            </div>
            
            <TabsContent value="americas" className="mt-0">
              <div className="space-y-4">
                {renderGroupedIndices("americas")}
              </div>
            </TabsContent>
            
            <TabsContent value="europe" className="mt-0">
              <div className="space-y-4">
                {renderGroupedIndices("europe")}
              </div>
            </TabsContent>
            
            <TabsContent value="asia" className="mt-0">
              <div className="space-y-4">
                {renderGroupedIndices("asia")}
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconCalendarStats className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div>
                Data provided for informational purposes only
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}