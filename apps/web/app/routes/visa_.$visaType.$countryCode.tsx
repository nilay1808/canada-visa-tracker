import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  assertValidVisaCategoryCode,
  getTitleForCategoryCode,
} from "~/lib/VisaCategoryCodes";
import { getHistoricalProcessingTimes } from "../ProcessingTimeData.server";
import { Timeline } from "../components/Timeline";

export async function loader({ params }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;
  assertValidVisaCategoryCode(visaType);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  const historicalData = await getHistoricalProcessingTimes(
    visaType,
    countryCode
  );

  return {
    visaType,
    countryCode,
    historicalData,
  };
}

export default function Page() {
  const { visaType, countryCode, historicalData } =
    useLoaderData<typeof loader>();

  const timelineData = historicalData.map((item) => ({
    updatedAt: item.publishedAt,
    title: item.estimateTime,
    description: item.countryName ?? item.countryCode,
  }));

  return (
    <div>
      <h1 className="text-2xl">Historical Processing Times</h1>
      <h2 className="text-xl text-gray-500 dark:text-gray-400">
        For {getTitleForCategoryCode(visaType).substring(3)} Visas submitted in{" "}
        {countryCode}
      </h2>

      <div className="flex justify-center">
        <Timeline timeline={timelineData} />
      </div>
    </div>
  );
}
