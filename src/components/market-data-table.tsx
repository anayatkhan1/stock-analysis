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
import { Sparkline } from "@/components/ui/sparkline";
import { MarketDataService, formatPercent } from "@/lib/data";
import { MarketItem } from "@/lib/data/types";

export function MarketDataTable() {
  const [activeTab, setActiveTab] = React.useState("indices");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [marketItems, setMarketItems] = React.useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch market data
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const items = await MarketDataService.getMarketItems();
        setMarketItems(items);
      } catch (error) {
        console.error("Failed to fetch market items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter data based on active tab
  const filteredData = React.useMemo(() => {
    const typeMap: Record<string, 'index' | 'commodity' | 'bond' | 'currency'> = {
      indices: 'index',
      commodities: 'commodity',
      bonds: 'bond',
      currencies: 'currency'
    };
    
    return marketItems.filter(item => item.type === typeMap[activeTab]);
  }, [activeTab, marketItems]);

  // Define columns based on the data structure
  const columns = React.useMemo<ColumnDef<MarketItem>[]>(() => {
    const baseColumns: ColumnDef<MarketItem>[] = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
    ];
    
    // Add country column only for indices
    if (activeTab === "indices") {
      baseColumns.push({
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => (
          <div>{row.getValue("country")}</div>
        ),
      });
    }
    
    // Add trend column
    baseColumns.push({
      accessorKey: "trend",
      header: "Trend",
      cell: ({ row }) => {
        const trend = row.getValue("trend") as number[];
        const isPositive = trend[trend.length - 1] >= trend[0];
        
        return (
          <div className="w-24">
            <Sparkline 
              data={trend} 
              color={isPositive ? "green" : "red"} 
              height={30}
            />
          </div>
        );
      },
    });
    
    // Add value and change columns
    return [
      ...baseColumns,
      {
        accessorKey: "value",
        header: () => <div className="text-right">Value</div>,
        cell: ({ row }) => {
          const value = row.getValue("value") as number;
          return (
            <div className="text-right font-medium">
              {value < 10 ? value.toFixed(4) : value.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "change1D",
        header: () => <div className="text-right">1D</div>,
        cell: ({ row }) => {
          const change = row.getValue("change1D") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "change1W",
        header: () => <div className="text-right">1W</div>,
        cell: ({ row }) => {
          const change = row.getValue("change1W") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "change1M",
        header: () => <div className="text-right">1M</div>,
        cell: ({ row }) => {
          const change = row.getValue("change1M") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "change3M",
        header: () => <div className="text-right">3M</div>,
        cell: ({ row }) => {
          const change = row.getValue("change3M") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "change6M",
        header: () => <div className="text-right">6M</div>,
        cell: ({ row }) => {
          const change = row.getValue("change6M") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
      {
        accessorKey: "change1Y",
        header: () => <div className="text-right">1Y</div>,
        cell: ({ row }) => {
          const change = row.getValue("change1Y") as number;
          const isPositive = change > 0;
          
          return (
            <div className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {formatPercent(change)}
            </div>
          );
        },
      },
    ];
  }, [activeTab]);

  const table = useReactTable({
    data: filteredData,
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
          <CardTitle>Global Markets</CardTitle>
          <CardDescription>
            Track major indices, commodities, bonds, and currencies from markets around the world
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p>Loading market data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Global Markets</CardTitle>
            <CardDescription>
              Track major indices, commodities, bonds, and currencies from markets around the world
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
        <Tabs defaultValue="indices" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        return (
                          <TableHead key={header.id} className="whitespace-nowrap">
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
                Showing {table.getRowModel().rows.length} of {filteredData.length}{" "}
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
  );
}