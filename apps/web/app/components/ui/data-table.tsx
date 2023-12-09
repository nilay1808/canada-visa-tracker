"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  title?: string;
  footer?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterPlaceholder: string;
  filterColumnAccessorKey: string;
}

export function DataTable<TData, TValue>({
  title = "Table Title",
  footer,
  columns,
  data,
  filterPlaceholder,
  filterColumnAccessorKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    return table
      .getColumn(filterColumnAccessorKey)
      ?.setFilterValue(event.target.value);
  };

  const inputValue =
    (table.getColumn(filterColumnAccessorKey)?.getFilterValue() as string) ??
    "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4">
        <h2 className="text-xl w-full text-left my-2 font-medium">{title}</h2>
        <div className="inline-flex w-full sm:items-center justify-end">
          <Input
            placeholder={filterPlaceholder}
            value={inputValue}
            onChange={onFilterChange}
            className="max-w-sm"
          />
          <Button
            className="ml-2"
            variant="secondary"
            disabled={!inputValue}
            onClick={() => {
              onFilterChange({ target: { value: "" } } as any);
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="font-semibold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <div className="w-full inline-flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {footer}
        </p>
        <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  );
}
