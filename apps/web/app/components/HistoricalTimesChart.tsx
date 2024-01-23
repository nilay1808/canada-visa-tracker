import { AreaChart } from "@tremor/react";

interface Props {
  data: {
    date: string;
    "Estimate Time": number;
  }[];
  valueUnit: string;
}

export const HistoricalTimesChart: React.FC<Props> = ({
  data = [],
  valueUnit,
}) => {
  return (
    <AreaChart
      className="h-72 md:h-80 my-4"
      data={data.toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )}
      index="date"
      categories={["Estimate Time"]}
      intervalType="preserveStartEnd"
      valueFormatter={(value) => `${value} ${valueUnit}`}
      curveType="linear"
      yAxisWidth={70}
      minValue={1}
      allowDecimals={false}
    />
  );
};
