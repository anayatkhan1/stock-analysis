"use client";

import * as React from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconSearch,
  IconWorldSearch,
  IconMapPin,
  IconChartBar,
  IconChartCandle,
  IconArrowsSort,
  IconCalendarStats,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
  CardHeader,
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

  const filterIndices = (indices: MarketIndex[]): MarketIndex[] => {
    if (!searchQuery) return indices;
    const query = searchQuery.toLowerCase();
    return indices.filter(
      (index) =>
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
          comparison =
            parseFloat(a.value.replace(/,/g, "")) -
            parseFloat(b.value.replace(/,/g, ""));
          break;
        case "change":
          const aChange = parseFloat(a.change.replace("%", "").replace(/[+\-]/g, ""));
          const bChange = parseFloat(b.change.replace("%", "").replace(/[+\-]/g, ""));
          comparison =
            a.isPositive === b.isPositive ? aChange - bChange : a.isPositive ? 1 : -1;
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
        <Badge
          variant={index.isPositive ? "outline" : "destructive"}
          className={index.isPositive ? "text-green-500 border-green-200" : "bg-red-500/10 text-red-500 border-red-200"}
        >
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Market Indices</CardTitle>
        <CardDescription>Major stock market indices from around the world</CardDescription>
      </CardHeader>
      <CardContent>
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

        <div className="space-y-4">
          {getProcessedIndices().map((index, i) => (
            <IndexItem key={i} index={index} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendarStats className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div>Data provided for informational purposes only</div>
        </div>
      </CardFooter>
    </Card>
  );
}