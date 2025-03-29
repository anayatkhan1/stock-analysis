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
  IconChevronDown,
  IconSearch,
  IconTrendingDown,
  IconTrendingUp,
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
import { Badge } from "@/components/ui/badge";
import { StockData, topStocks } from "@/app/app/stock-data";
import { StockDetailSheet } from "@/components/stock-detail-sheet";

export function StockTable() {
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
  const [selectedStock, setSelectedStock] = React.useState<StockData | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);


  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}T`;
    }
    return `$${marketCap.toFixed(2)}B`;
  };

  const formatPercent = (percent: number): string => {
    return (percent > 0 ? "+" : "") + percent.toFixed(2) + "%";
  };


  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setSheetOpen(true);
  };

  const columns: ColumnDef<StockData>[] = [
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => (
        <div
          className="cursor-pointer font-medium hover:text-primary hover:underline"
          onClick={() => handleStockClick(row.original)}
        >
          {row.getValue("symbol")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Company",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">${row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "changePercent",
      header: () => <div className="text-right">Change</div>,
      cell: ({ row }) => {
        const changePercent = row.getValue("changePercent") as number;
        const isPositive = changePercent > 0;

        return (
          <div
            className={`flex items-center justify-end gap-1 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
            <span>{formatPercent(changePercent)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-right">Volume (M)</div>,
      cell: ({ row }) => (
        <div className="text-right">{formatNumber(row.getValue("volume"))}</div>
      ),
    },
    {
      accessorKey: "marketCap",
      header: () => <div className="text-right">Market Cap</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {formatMarketCap(row.getValue("marketCap"))}
        </div>
      ),
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
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.getValue("sector")}
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data: topStocks,
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
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (typeof value === "string") {
        return value.toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    },
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    table.setGlobalFilter(e.target.value);
  };

  return (
    <>
      <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Top Stocks</CardTitle>
              <CardDescription>
                Market leaders by market capitalization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id}>
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
              Showing {table.getRowModel().rows.length} of {topStocks.length}{" "}
              stocks
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
        </CardContent>
      </Card>

      {selectedStock && (
        <StockDetailSheet
          stock={selectedStock}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </>
  );
}
