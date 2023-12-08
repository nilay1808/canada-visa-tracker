import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Link } from "@remix-run/react";

interface ProcessingTimeForCountry {
  estimateTime: string;
  countryName: string;
  historicalViewLink: string;
}

const columns: ColumnDef<ProcessingTimeForCountry>[] = [
  {
    accessorKey: "countryName",
    header: () => <>🌎 &nbsp; Country</>,
  },
  {
    accessorKey: "estimateTime",
    header: "Latest Processing time",
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
      <DataTable
        title={title}
        footer={`Updated on ${lastUpdated}`}
        columns={columns}
        data={processingTimes}
        filterPlaceholder="Filter by country name (E.x United States)"
        filterColumnAccessorKey="countryName"
      />
    </div>
  );
};
