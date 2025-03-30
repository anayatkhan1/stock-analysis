"use client";

import * as React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketDataService, formatNumber, formatPercent } from "@/lib/data";
import type { MarketIndex } from "@/lib/data";

interface SectionCardsProps {
  onSelectIndex?: (indexName: string) => void;
}

export function SectionCards({ onSelectIndex }: SectionCardsProps) {
  const [indices, setIndices] = React.useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch market indices data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const marketIndices = await MarketDataService.getMarketIndices();
        setIndices(marketIndices);
      } catch (error) {
        console.error("Failed to fetch market indices:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCardClick = (indexName: string) => {
    if (onSelectIndex) {
      onSelectIndex(indexName);
    }
  };

  if (isLoading) {
    return (
      <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 lg:px-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-[180px] flex items-center justify-center">
            <p>Loading market data...</p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card">
      {indices.map(index => (
        <Card
          key={index.name}
          className="@container/card cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleCardClick(index.name)}
        >
          <CardHeader>
            <CardDescription>{index.name}</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {formatNumber(index.value)}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  index.changePercent > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {index.changePercent > 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {formatPercent(index.changePercent)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {index.change > 0 ? (
                <>
                  Up {formatNumber(index.change)} points{" "}
                  <IconTrendingUp className="size-4 text-green-500" />
                </>
              ) : (
                <>
                  Down {formatNumber(Math.abs(index.change))} points{" "}
                  <IconTrendingDown className="size-4 text-red-500" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
