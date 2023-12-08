import { Link } from "@remix-run/react";
import { getInfoForVisaType, type VisaType } from "~/lib/VisaCategoryCodes";
import { Card } from "./ui/card";

interface CategoryCardProps {
  categoryCode: VisaType;
}

export function CategoryCard({ categoryCode }: CategoryCardProps) {
  const { title, icon, description } = getInfoForVisaType(categoryCode);

  return (
    <Link to={`/visa/${categoryCode}`}>
      <Card className="p-6 h-full flex flex-col justify-start gap-3 hover:bg-gray-100 hover:dark:border-gray-600 hover:dark:bg-gray-900">
        <h3 className="text-lg font-medium">
          {icon}
          &nbsp;&nbsp;
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </Card>
    </Link>
  );
}
