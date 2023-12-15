import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";

interface ProcessingTimeForCountry {
  estimateTime: string;
  countryName: string;
  historicalViewLink: string;
}

const columns: ColumnDef<ProcessingTimeForCountry>[] = [
  {
    accessorKey: "countryName",
    header: "Country",
  },
  {
    accessorKey: "estimateTime",
    header: "Processing Time",
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
  lastUpdated?: string;
  processingTimes: ProcessingTimeForCountry[];
}

export const ProcessingTimeTable = ({
  title,
  processingTimes,
  lastUpdated,
}: ProcessingTimeTableProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onSearchUpdate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const pathname = location.pathname;
      const value = event.target.value;

      if (!value) {
        navigate({
          pathname,
        });
        return;
      }

      navigate({
        pathname,
        search: `?country=${event.target.value}`,
      });
    },
    [location?.pathname, navigate]
  );

  const country = useMemo(
    () =>
      new URLSearchParams(location?.search ?? "").get("country") ?? undefined,
    [location?.search]
  );

  return (
    <div>
      <DataTable
        title={title}
        footer={lastUpdated ? `Updated on ${lastUpdated}` : undefined}
        columns={columns}
        data={processingTimes}
        filterPlaceholder="Filter by country name (E.x United States)"
        filterColumnAccessorKey="countryName"
        onSearchUpdate={onSearchUpdate}
        initialSearchValue={country}
      />
    </div>
  );
};
