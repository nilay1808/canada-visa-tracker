import type { LoaderFunctionArgs } from "@remix-run/node";
import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { Await, useLoaderData } from "@remix-run/react";
import { defer } from "@remix-run/node";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Statistics, StatisticsSkeleton } from "../components/Statistics";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return defer(
    {
      visaType,
      processingTimeData: processingTimeService.getProcessingTimes(visaType),
      statsData: processingTimeService.getStatistics(visaType),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimeData, statsData } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Suspense fallback={<StatisticsSkeleton />}>
        <Await resolve={statsData}>
          {(stats) => (
            <Statistics
              statistics={[
                {
                  title: "Fastest",
                  value: stats?.fastest?.estimateTime ?? "N/A",
                  unit: stats?.fastest?.countryName ?? "",
                  link: `/${visaType}/${stats?.fastest?.countryCode}`,
                },
                {
                  title: "Median",
                  value: stats?.median?.estimateTime ?? "N/A",
                  unit: stats?.median?.countryName ?? "",
                  link: `/${visaType}/${stats?.median?.countryCode}`,
                },
                {
                  title: "Slowest",
                  value: stats?.slowest?.estimateTime ?? "N/A",
                  unit: stats?.slowest?.countryName ?? "",
                  link: `/${visaType}/${stats?.slowest?.countryCode}`,
                },
              ]}
            />
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[700px] w-full" />}>
        <Await resolve={processingTimeData}>
          {(processingTimes) => (
            <div>
              <ProcessingTimeTable
                title="Processing Times Estimates"
                processingTimes={processingTimes}
              />
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
}
