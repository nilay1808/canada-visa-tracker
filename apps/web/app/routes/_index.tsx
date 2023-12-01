import type { MetaFunction } from "@remix-run/node";
import { viasCategoryCodes } from "~/lib/VisaCategoryCodes";
import { CategoryCard } from "../components/VisaCategoryCard";

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
    <div>
      <h1 className="text-2xl">Canada Visa Processing times</h1>
      <p>
        This is an unofficial website that shows the latest processing times for
        Canadian visas.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {viasCategoryCodes.map((categoryCode) => (
          <CategoryCard key={categoryCode} categoryCode={categoryCode} />
        ))}
      </div>
    </div>
  );
}
