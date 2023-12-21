import { Link } from "@remix-run/react";
import { Card } from "./ui/card";

interface StatisticsProps {
  title: string;
  statistics: StatisticCardProps[];
}

export const Statistics = ({ title, statistics }: StatisticsProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-medium my-2">{title}</h1>
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
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
  link: string;
}

export const StatisticCard = ({
  title,
  value,
  unit,
  link,
}: StatisticCardProps) => {
  return (
    <Link to={link}>
      <Card className="p-4 w-full flex flex-col items-center hover:bg-gray-100 hover:dark:bg-gray-900">
        <div className="text-sm sm:text-md font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </div>
        <div className="text-xl font-bold text-center py-1">{value}</div>
        <div className="text-sm font-medium">{unit}</div>
      </Card>
    </Link>
  );
};
