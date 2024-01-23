import type { MetaFunction } from "@remix-run/node";
import { visaTypes } from "~/lib/VisaCategoryCodes";
import { CategoryCard } from "../components/VisaCategoryCard";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Canada Visa Tracker" },
    {
      name: "description",
      content:
        "Unofficial tracker for processing times for different Canadian Visas",
    },
  ];
};

export default function Index() {
  return (
    <div className="sm:mt-8">
      <div className="mb-12">
        <h1 className="text-2xl font-medium mb-1">
          Check processing times for Canadian visas
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          This is an unofficial website that shows the latest and historical
          processing times for Canadian visas. The{" "}
          <Link
            className="hover:underline font-semibold"
            to="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html"
          >
            official website
          </Link>{" "}
          is a harder to use and shows only the latest processing times.
        </p>
      </div>

      <h2 className="text-2xl mb-4 font-medium">Visa Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visaTypes.map((categoryCode) => (
          <CategoryCard key={categoryCode} categoryCode={categoryCode} />
        ))}
      </div>
    </div>
  );
}
