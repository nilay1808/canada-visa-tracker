import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { defer } from "@remix-run/node";
import {
  getLatestStatsForVisaType,
  getProcessingTimesDataForVisaType,
} from "../ProcessingTimeData.server";
import { Statistics } from "../components/Statistics";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return defer({
    visaType,
    processingTimeData: getProcessingTimesDataForVisaType(visaType),
    stats: getLatestStatsForVisaType(visaType),
  });
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimeData, stats } =
    useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {getInfoForVisaType(visaType).title} Visa Details
      </h1>

      <Suspense fallback={<Skeleton className="h-[150px] w-full" />}>
        <Await resolve={stats}>
          {(stats) => {
            return (
              <Statistics
                title="Global Statistics"
                statistics={[
                  {
                    title: "Fastest",
                    value: stats.fastest.estimateTime,
                    unit: stats.fastest.countryName ?? "",
                  },
                  {
                    title: "Slowest",
                    value: stats.slowest.estimateTime,
                    unit: stats.slowest.countryName ?? "",
                  },
                ]}
              />
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[700px] w-full" />}>
        <Await resolve={processingTimeData}>
          {({ publishedAt, processingTimes }) => (
            <div>
              <ProcessingTimeTable
                title="Processing Times"
                lastUpdated={publishedAt}
                processingTimes={processingTimes}
              />
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
}
