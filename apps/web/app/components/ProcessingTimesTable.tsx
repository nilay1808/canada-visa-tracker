import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Link } from "@remix-run/react";

interface ProcessingTimeForCountry {
  estimateTime: string;
  countryName: string;
  // countryCode: string;
  historicalViewLink: string;
}

const columns: ColumnDef<ProcessingTimeForCountry>[] = [
  {
    accessorKey: "countryName",
    header: "🌎 Country",
  },
  {
    accessorKey: "estimateTime",
    header: "🕰️ Latest Processing time",
  },
  {
    header: "Historical Data",
    accessorKey: "historicalViewLink",
    cell: ({ row }) => {
      return <Link to={row.getValue("historicalViewLink")}>View</Link>;
    },
  },
];

interface ProcessingTimeTableProps {
  title: string;
  lastUpdated: string;
  processingTimes: ProcessingTimeForCountry[];
}

export const ProcessingTimeTable = ({
  title,
  processingTimes,
  lastUpdated,
}: ProcessingTimeTableProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between align-middle items-center">
        <h2 className="text-xl text-center sm:text-left my-2">{title}</h2>
        <p className="text-sm">Last Updated: {lastUpdated.toString()}</p>
      </div>
      <DataTable
        columns={columns}
        data={processingTimes}
        filterPlaceholder="Filter by country name (E.x United States)"
        filterColumnAccessorKey="countryName"
      />
    </div>
  );
};
