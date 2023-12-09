import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { defer, redirect } from "@remix-run/node";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Statistics } from "../components/Statistics";
import { prettyDateString } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;

  try {
    assertValidVisaCategoryCode(visaType);
  } catch (error) {
    return redirect("/");
  }

  const publishedAt = await processingTimeService.getLatestPublishedAt(
    visaType
  );

  return defer({
    visaType,
    publishedAt,
    processingTimeData: processingTimeService.getProcessingTimes(
      visaType,
      publishedAt
    ),
    stats: processingTimeService.getStatistics(visaType, publishedAt),
  });
}

export default function VisaProcessingTimes() {
  const { visaType, publishedAt, processingTimeData, stats } =
    useLoaderData<typeof loader>();

  return (
    <>
      <div className="w-full inline-flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold mb-4">
          {getInfoForVisaType(visaType).title} Visa Details
        </h1>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Updated on {prettyDateString(new Date(publishedAt))}
        </h3>
      </div>

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
                    title: "Median",
                    value: stats.median.estimateTime,
                    unit: stats.median.countryName ?? "",
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
          {(processingTimes) => (
            <div>
              <ProcessingTimeTable
                title="Processing Times"
                processingTimes={processingTimes}
              />
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
}
