"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MarketSummary } from "@/components/market-summary";
import { StockTable } from "@/components/stock-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IconChartBar,
  IconBuildingBank,
  IconChartCandle,
  IconChartPie,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

export default function IndianMarketsPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<string>("NIFTY 50");
  const [activeTab, setActiveTab] = React.useState<string>("overview");

  const handleSelectIndex = (indexName: string) => {
    setSelectedIndex(indexName);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="px-4 lg:px-6">
          <Card className="border-0 border-0 border-0 border-0 bg-gradient-to-shadow-sm r from-orshadow-sm ange-50 tshadow-sm o-re">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold font-bol tracking-tight">
                  Indian Markets
                </h1>
                <p className="text-muted-foreground">
                  Track BSE and NSE indices, stocks, and market trends in the
                  Indian stock market
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4 lg:px-6"
        >
          <TabsList className="mb-4 mb-4 mb-4 mb-4 grid w-f">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <IconChartBar className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="nse" className="flex items-center gap-2">
              <IconBuildingBank className="h-4 w-4" />
              <span>NSE</span>
            </TabsTrigger>
            <TabsTrigger value="bse" className="flex items-center gap-2">
              <IconChartCandle className="h-4 w-4" />
              <span>BSE</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 gap-4 gap-4 gap-4 md:grid-c-4">
              {/* NSE Card */}
              <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                <CardHeader className="pb-2">
                  <CardDescription>NSE</CardDescription>
                  <CardTitle className="font-semibold font-sem">
                    NIFTY 50
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="een-500 text-green-500 text-green-500"
                  >
                    <IconTrendingUp className="mr-1 mr-1 mr" />
                    +0.75%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold font-sem">22,456.80</div>
                  <div className="mtm1ed-foreground textextextextssm">
                    Up 167.45 points today
                  </div>
                </CardContent>
              </Card>

              {/* BSE Card */}
              <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                <CardHeader className="pb-2">
                  <CardDescription>BSE</CardDescription>
                  <CardTitle className="font-semibold font-sem">
                    SENSEX
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="een-500 text-green-500 text-green-500"
                  >
                    <IconTrendingUp className="mr-1 mr-1 mr" />
                    +0.82%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold font-sem">73,648.62</div>
                  <div className="mtm1ed-foreground textextextextssm">
                    Up 601.19 points today
                  </div>
                </CardContent>
              </Card>

              {/* Bank NIFTY Card */}
              <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                <CardHeader className="pb-2">
                  <CardDescription>NSE</CardDescription>
                  <CardTitle className="font-semibold font-sem">
                    BANK NIFTY
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="t-red-500 text-red-500 text-red-500"
                  >
                    <IconTrendingDown className="mr-1 mr-1 mr" />
                    -0.23%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold font-sem">48,123.45</div>
                  <div className="mtm1ed-foreground textextextextssm">
                    Down 110.85 points today
                  </div>
                </CardContent>
              </Card>

              {/* NIFTY IT Card */}
              <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                <CardHeader className="pb-2">
                  <CardDescription>NSE</CardDescription>
                  <CardTitle className="font-semibold font-sem">
                    NIFTY IT
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="een-500 text-green-500 text-green-500"
                  >
                    <IconTrendingUp className="mr-1 mr-1 mr" />
                    +1.45%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold font-sem">36,789.20</div>
                  <div className="mtm1ed-foreground textextextextssm">
                    Up 528.30 points today
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ChartAreaInteractive selectedIndex={selectedIndex} />

              <div className="grid grid-cols-1 gap-6 gap-6 gap-6 ga">
                <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconChartPie className="h-5 w-5" />
                      Sectoral Performance
                    </CardTitle>
                    <CardDescription>
                      NSE sectoral indices performance today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* IT Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">IT</div>
                          <span className="text-green-500">+1.45%</span>
                        </div>
                        <Progress
                          value={85}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      {/* FMCG Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">FMCG</div>
                          <span className="text-green-500">+0.92%</span>
                        </div>
                        <Progress
                          value={70}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      {/* Auto Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Auto</div>
                          <span className="text-green-500">+0.65%</span>
                        </div>
                        <Progress
                          value={60}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      {/* Pharma Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Pharma</div>
                          <span className="text-green-500">+0.38%</span>
                        </div>
                        <Progress
                          value={45}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      {/* Bank Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Bank</div>
                          <span className="text-red-500">-0.23%</span>
                        </div>
                        <Progress
                          value={30}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-red-500"
                        />
                      </div>

                      {/* Metal Sector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Metal</div>
                          <span className="text-red-500">-0.87%</span>
                        </div>
                        <Progress
                          value={15}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <MarketSummary />
              </div>

              <StockTable />
            </div>
          </TabsContent>

          <TabsContent value="nse" className="space-y-6">
            <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
              <CardHeader>
                <CardTitle>NSE Indices</CardTitle>
                <CardDescription>
                  National Stock Exchange of India indices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 gap-4 gap-4 ga">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Broad Market Indices</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY 50</span>
                        <span className="text-green-500">
                          22,456.80 (+0.75%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY NEXT 50</span>
                        <span className="text-green-500">
                          63,782.15 (+0.82%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY 100</span>
                        <span className="text-green-500">
                          23,567.90 (+0.78%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY 200</span>
                        <span className="text-green-500">
                          14,321.45 (+0.71%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY 500</span>
                        <span className="text-green-500">
                          21,876.30 (+0.68%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Sectoral Indices</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY BANK</span>
                        <span className="text-red-500">48,123.45 (-0.23%)</span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY IT</span>
                        <span className="text-green-500">
                          36,789.20 (+1.45%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY FMCG</span>
                        <span className="text-green-500">
                          52,345.67 (+0.92%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY AUTO</span>
                        <span className="text-green-500">
                          19,876.54 (+0.65%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>NIFTY PHARMA</span>
                        <span className="text-green-500">
                          17,654.32 (+0.38%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bse" className="space-y-6">
            <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
              <CardHeader>
                <CardTitle>BSE Indices</CardTitle>
                <CardDescription>Bombay Stock Exchange indices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 gap-4 gap-4 ga">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Broad Market Indices</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>SENSEX</span>
                        <span className="text-green-500">
                          73,648.62 (+0.82%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE 100</span>
                        <span className="text-green-500">
                          24,567.89 (+0.79%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE 200</span>
                        <span className="text-green-500">
                          15,432.10 (+0.73%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE 500</span>
                        <span className="text-green-500">
                          22,345.67 (+0.70%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE MIDCAP</span>
                        <span className="text-green-500">
                          34,567.89 (+0.65%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Sectoral Indices</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE BANKEX</span>
                        <span className="text-red-500">49,876.54 (-0.18%)</span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE IT</span>
                        <span className="text-green-500">
                          37,654.32 (+1.42%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE FMCG</span>
                        <span className="text-green-500">
                          18,765.43 (+0.90%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE AUTO</span>
                        <span className="text-green-500">
                          51,234.56 (+0.62%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between xt-sm text-sm text-sm">
                        <span>BSE HEALTHCARE</span>
                        <span className="text-green-500">
                          28,765.43 (+0.35%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
