"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconChartLine,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StockDetailSheet } from "@/components/stock-detail-sheet";
import { MarketDataService, formatNumber, formatPercent } from "@/lib/data";
import { StockData } from "@/lib/data";

export function IndianMarketDataTable() {
  const [activeTab, setActiveTab] = React.useState("stocks");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "marketCap", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      volume: false,
      pe: false,
    });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stocks, setStocks] = React.useState<StockData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedStock, setSelectedStock] = React.useState<StockData | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Fetch stocks data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const topStocks = await MarketDataService.getTopStocks();
        setStocks(topStocks);
      } catch (error) {
        console.error("Failed to fetch top stocks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle stock click to open chart plotting sidebar
  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setSheetOpen(true);
  };

  // Define columns based on the data structure
  const columns = React.useMemo<ColumnDef<StockData>[]>(() => {
    return [
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("symbol")}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "Company",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "sector",
        header: "Sector",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-normal">
            {row.getValue("sector")}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">${row.getValue("price")}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={e => {
                  e.stopPropagation();
                  handleStockClick(row.original);
                }}
              >
                <IconChartLine className="h-4 w-4" />
                <span className="sr-only">View details</span>
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "changePercent",
        header: () => <div className="text-right">1D</div>,
        cell: ({ row }) => {
          const change = row.getValue("changePercent") as number;
          const isPositive = change > 0;

          return (
            <div
              className={`text-right ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "volume",
        header: () => <div className="text-right">Volume (M)</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {formatNumber(row.getValue("volume"))}
          </div>
        ),
      },
      {
        accessorKey: "marketCap",
        header: () => <div className="text-right">Market Cap</div>,
        cell: ({ row }) => {
          const marketCap = row.getValue("marketCap") as number;
          return (
            <div className="text-right">
              $
              {marketCap > 1000
                ? `${(marketCap / 1000).toFixed(2)}T`
                : `${marketCap}B`}
            </div>
          );
        },
      },
      {
        accessorKey: "pe",
        header: () => <div className="text-right">P/E Ratio</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {(row.getValue("pe") as number).toFixed(1)}
          </div>
        ),
      },
    ];
  }, []);

  const table = useReactTable({
    data: stocks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: searchQuery,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    table.setGlobalFilter(e.target.value);
  };

  if (isLoading) {
    return (
      <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
        <CardHeader>
          <CardTitle>Indian Markets</CardTitle>
          <CardDescription>
            Track BSE and NSE stocks, indices, and market trends
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p>Loading market data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Indian Markets</CardTitle>
              <CardDescription>
                Track BSE and NSE stocks, indices, and market trends
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <IconChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={value =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="stocks"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="nse">NSE</TabsTrigger>
              <TabsTrigger value="bse">BSE</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                          return (
                            <TableHead
                              key={header.id}
                              className="whitespace-nowrap"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map(row => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleStockClick(row.original)}
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-muted-foreground text-sm">
                  Showing {table.getRowModel().rows.length} of {stocks.length}{" "}
                  items
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stock Detail Sheet */}
      <StockDetailSheet
        stock={selectedStock}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
