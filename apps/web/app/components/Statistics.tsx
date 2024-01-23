import { Link } from "@remix-run/react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface StatisticsProps {
  statistics: StatisticCardProps[];
}

export const Statistics = ({ statistics }: StatisticsProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-medium my-2">Global Statistics</h1>
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {statistics.map((statistic, index) => (
          <StatisticCard {...statistic} key={`statistic-${index}`} />
        ))}
      </div>
    </div>
  );
};

export const StatisticsSkeleton = () => {
  return (
    <div className="flex flex-col h-[170px] mb-8">
      <h1 className="text-xl font-medium my-2">Global Statistics</h1>
      <div className="h-full grid grid-cols-3 gap-2 sm:gap-6">
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
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
    <Link prefetch="intent" to={link}>
      <Card className="p-4 w-full h-full flex flex-col items-center hover:bg-gray-100 hover:dark:bg-gray-900">
        <div className="text-sm sm:text-md font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </div>
        <div className="text-xl font-bold text-center py-1">{value}</div>
        <div className="text-sm font-medium text-center">{unit}</div>
      </Card>
    </Link>
  );
};
