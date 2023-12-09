import { Card } from "./ui/card";

interface StatisticsProps {
  title: string;
  statistics: StatisticCardProps[];
}

export const Statistics = ({ title, statistics }: StatisticsProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-medium my-2">{title}</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {statistics.map((statistic, index) => (
          <StatisticCard {...statistic} key={`statistic-${index}`} />
        ))}
      </div>
    </div>
  );
};

interface StatisticCardProps {
  title: string;
  value: string;
  unit: string;
}

export const StatisticCard = ({ title, value, unit }: StatisticCardProps) => {
  return (
    <Card className="p-4 w-full flex flex-col items-center">
      <div className="font-semibold text-gray-600 dark:text-gray-400">
        {title}
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm font-semibold">{unit}</div>
    </Card>
  );
};
