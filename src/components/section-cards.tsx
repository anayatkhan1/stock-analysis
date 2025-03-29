"use client";

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
import { marketIndices } from "@/app/app/stock-data";

interface SectionCardsProps {
  onSelectIndex?: (indexName: string) => void;
}

export function SectionCards({ onSelectIndex }: SectionCardsProps) {

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const formatPercent = (percent: number): string => {
    return (percent > 0 ? "+" : "") + percent.toFixed(2) + "%";
  };

  const handleCardClick = (indexName: string) => {
    if (onSelectIndex) {
      onSelectIndex(indexName);
    }
  };

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card">
      {marketIndices.map(index => (
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
