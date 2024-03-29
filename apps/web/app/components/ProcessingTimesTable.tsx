import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table.client";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

interface ProcessingTimeForCountry {
  estimateTime: string;
  countryName: string;
  historicalViewLink: string;
}

const columns: ColumnDef<ProcessingTimeForCountry>[] = [
  {
    accessorKey: "countryName",
    header: ({ column }) => {
      return (
        <Button
          className="w-full h-full justify-start pl-2 rounded-none hover:bg-gray-200 hover:dark:bg-gray-800"
          variant="ghost"
          onClick={() => {
            const desc =
              column.getIsSorted() === false
                ? false
                : column.getIsSorted() === "asc"
                  ? true
                  : undefined;
            column.toggleSorting(desc);
          }}
        >
          Country
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            )
          ) : null}
        </Button>
      );
    },
  },
  {
    accessorKey: "estimateTime",
    header: ({ column }) => {
      return (
        <Button
          className="w-full h-full justify-start pl-2 rounded-none hover:bg-gray-200 hover:dark:bg-gray-800"
          variant="ghost"
          onClick={() => {
            const desc =
              column.getIsSorted() === false
                ? false
                : column.getIsSorted() === "asc"
                  ? true
                  : undefined;
            column.toggleSorting(desc);
          }}
        >
          Processing Time
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            )
          ) : null}
        </Button>
      );
    },
  },
  {
    accessorKey: "historicalViewLink",
    header: ({ column }) => {
      return <div className="pl-2 sm:pl-4">Details</div>;
    },
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link prefetch="intent" to={row.getValue("historicalViewLink")}>
            View
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      );
    },
  },
];

interface ProcessingTimeTableProps {
  title: string;
  lastUpdated?: string;
  processingTimes: ProcessingTimeForCountry[];
}

export const ProcessingTimeTable = ({
  title,
  processingTimes,
  lastUpdated,
}: ProcessingTimeTableProps) => {
  return (
    <DataTable
      title={title}
      footer={lastUpdated ? `Updated on ${lastUpdated}` : undefined}
      columns={columns}
      data={processingTimes}
      filterPlaceholder="Filter by country name (E.x United States)"
      filterColumnAccessorKey="countryName"
    />
  );
};
