import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import { MarketDataService, formatPercent, formatNumber } from "@/lib/data";
import type { StockData } from "@/lib/data";

interface SectorStocksPageProps {
  sectorId: string;
  onBack: () => void;
}

export function SectorStocksPage({ sectorId, onBack }: SectorStocksPageProps) {
  const [stocks, setStocks] = React.useState<StockData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch stocks for the selected sector
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // In a real app, we would filter by sector ID
        // Here we're just getting all stocks and filtering client-side
        const allStocks = await MarketDataService.getTopStocks();
        const sectorStocks = allStocks.filter(
          stock => stock.sector.toLowerCase() === sectorId.toLowerCase(),
        );
        setStocks(sectorStocks);
      } catch (error) {
        console.error(`Failed to fetch stocks for sector ${sectorId}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [sectorId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <CardTitle className="capitalize">{sectorId} Stocks</CardTitle>
          <CardDescription>Stocks in the {sectorId} sector</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading stocks...</p>
          </div>
        ) : stocks.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>No stocks found for this sector.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map(stock => (
                <Card
                  key={stock.symbol}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {stock.symbol}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {stock.name}
                        </CardDescription>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stock.changePercent > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatPercent(stock.changePercent)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          ${formatNumber(stock.price)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Volume</span>
                        <span className="font-medium">{stock.volume}M</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">
                          Market Cap
                        </span>
                        <span className="font-medium">${stock.marketCap}B</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">P/E Ratio</span>
                        <span className="font-medium">{stock.pe}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
