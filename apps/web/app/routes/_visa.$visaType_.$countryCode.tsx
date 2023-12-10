import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";

import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Timeline } from "../components/Timeline";
import { getCountryName } from "~/lib/countryCodeToCountry";
import { prettyDateString } from "~/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";

export async function loader({ params }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;
  assertValidVisaCategoryCode(visaType);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  return defer({
    visaType,
    countryCode,
    historicalData: processingTimeService.getHistoricalProcessingTimes(
      visaType,
      countryCode
    ),
  });
}

export default function Page() {
  const { countryCode, historicalData } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-200">
        Historical Data for {getCountryName(countryCode)}
      </h2>

      <div className="flex flex-col sm:flex-row gap-x-16 gap-y-8">
        {/*  */}
        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">Interpreting this data</h3>
          <p>
            The Canadian Govenment published updates to their processing times
            on a weekly basis. However, this estimate is a backwards looking
            estimate.
          </p>
        </div>

        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">Timeline</h3>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <Await resolve={historicalData}>
              {(timelineData) => (
                <Timeline
                  timeline={timelineData.map((item) => ({
                    updatedAt: prettyDateString(item.publishedAt),
                    title: item.estimateTime,
                    description: `${item.countryName ?? item.countryCode} - ${
                      getInfoForVisaType(item.visaType).title
                    } Visa`,
                  }))}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </>
  );
}
