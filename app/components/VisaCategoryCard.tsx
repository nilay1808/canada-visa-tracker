import { Link } from "@remix-run/react";
import {
  getTitleForCategoryCode,
  type VisaCategoryCode,
} from "~/lib/VisaCategoryCodes";
import { Card } from "./ui/card";

interface CategoryCardProps {
  categoryCode: VisaCategoryCode;
}

export function CategoryCard({ categoryCode }: CategoryCardProps) {
  return (
    <Link to={`/${categoryCode}`}>
      <Card className="p-4">
        <h3 className="text-lg font-medium">
          {getTitleForCategoryCode(categoryCode)} Visa
        </h3>
        <p className="text-md">Lorem isum</p>
      </Card>
    </Link>
  );
}
