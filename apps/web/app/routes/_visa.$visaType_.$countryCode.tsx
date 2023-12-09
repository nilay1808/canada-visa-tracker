import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Timeline } from "../components/Timeline";
import { getCountryName } from "~/lib/countryCodeToCountry";
import { prettyDateString } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;
  assertValidVisaCategoryCode(visaType);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  const historicalData =
    await processingTimeService.getHistoricalProcessingTimes(
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
    updatedAt: prettyDateString(item.publishedAt),
    title: item.estimateTime,
    description: item.countryName ?? item.countryCode,
  }));

  return (
    <div>
      <h1 className="text-2xl mb-8 text-gray-900 dark:text-gray-200">
        {getInfoForVisaType(visaType).title} Visa Processing Times for{" "}
        {getCountryName(countryCode)}
      </h1>

      <div className="flex justify-center">
        <Timeline timeline={timelineData} />
      </div>
    </div>
  );
}
