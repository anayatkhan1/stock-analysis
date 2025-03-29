"use client";

import * as React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function GlobalMarketIndices() {
  const [region, setRegion] = React.useState("americas");

  return (
    <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
      <CardHeader>
        <CardTitle>Global Market Indices</CardTitle>
        <CardDescription>
          Major stock market indices from around the world
        </CardDescription>
        <Tabs value={region} onValueChange={setRegion} className="mt-2">
          <TabsList>
            <TabsTrigger value="americas">Americas</TabsTrigger>
            <TabsTrigger value="europe">Europe</TabsTrigger>
            <TabsTrigger value="asia">Asia-Pacific</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="americas" className="mt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* US Indices */}
              <div className="space-y-4">
                <h3 className="font-semibold">United States</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">S&P 500</div>
                      <div className="text-sm text-muted-foreground">US Large Cap</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">5,234.56</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.75%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dow Jones</div>
                      <div className="text-sm text-muted-foreground">US Blue Chip</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">38,765.43</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.62%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Nasdaq</div>
                      <div className="text-sm text-muted-foreground">US Tech</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">16,432.10</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +1.23%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Russell 2000</div>
                      <div className="text-sm text-muted-foreground">US Small Cap</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2,123.45</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.32%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Canada & Latin America */}
              <div className="space-y-4">
                <h3 className="font-semibold">Canada & Latin America</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">S&P/TSX</div>
                      <div className="text-sm text-muted-foreground">Canada</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">21,876.54</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.45%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">IPC</div>
                      <div className="text-sm text-muted-foreground">Mexico</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">56,789.01</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.38%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Bovespa</div>
                      <div className="text-sm text-muted-foreground">Brazil</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">127,654.32</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.56%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">IPSA</div>
                      <div className="text-sm text-muted-foreground">Chile</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">6,543.21</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.21%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="europe" className="mt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Western Europe */}
              <div className="space-y-4">
                <h3 className="font-semibold">Western Europe</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">FTSE 100</div>
                      <div className="text-sm text-muted-foreground">UK</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">7,876.54</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.58%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">DAX</div>
                      <div className="text-sm text-muted-foreground">Germany</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">18,432.10</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.72%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">CAC 40</div>
                      <div className="text-sm text-muted-foreground">France</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">7,654.32</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.65%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">IBEX 35</div>
                      <div className="text-sm text-muted-foreground">Spain</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">10,123.45</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.42%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other Europe */}
              <div className="space-y-4">
                <h3 className="font-semibold">Other European Markets</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">STOXX 600</div>
                      <div className="text-sm text-muted-foreground">Pan-Europe</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">498.76</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.61%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">FTSE MIB</div>
                      <div className="text-sm text-muted-foreground">Italy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">32,765.43</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.53%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMI</div>
                      <div className="text-sm text-muted-foreground">Switzerland</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">11,543.21</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.48%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">OMX</div>
                      <div className="text-sm text-muted-foreground">Stockholm</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2,456.78</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.12%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="asia" className="mt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* East Asia */}
              <div className="space-y-4">
                <h3 className="font-semibold">East Asia</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Nikkei 225</div>
                      <div className="text-sm text-muted-foreground">Japan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">38,765.43</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +1.25%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Shanghai Composite</div>
                      <div className="text-sm text-muted-foreground">China</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">3,234.56</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.45%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Hang Seng</div>
                      <div className="text-sm text-muted-foreground">Hong Kong</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">18,765.43</div>
                      <Badge variant="outline" className="text-red-500">
                        <IconTrendingDown className="h-3 w-3 mr-1" />
                        -0.32%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">KOSPI</div>
                      <div className="text-sm text-muted-foreground">South Korea</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2,654.32</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.78%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other Asia-Pacific */}
              <div className="space-y-4">
                <h3 className="font-semibold">Other Asia-Pacific</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">ASX 200</div>
                      <div className="text-sm text-muted-foreground">Australia</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">7,654.32</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.52%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SENSEX</div>
                      <div className="text-sm text-muted-foreground">India</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">73,648.62</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.82%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">TAIEX</div>
                      <div className="text-sm text-muted-foreground">Taiwan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">20,123.45</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +1.05%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">NZX 50</div>
                      <div className="text-sm text-muted-foreground">New Zealand</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">11,876.54</div>
                      <Badge variant="outline" className="text-green-500">
                        <IconTrendingUp className="h-3 w-3 mr-1" />
                        +0.35%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}