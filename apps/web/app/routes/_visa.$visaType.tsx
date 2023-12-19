import type { LoaderFunctionArgs } from "@remix-run/node";
import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { defer } from "@remix-run/node";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Statistics } from "../components/Statistics";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return defer({
    visaType,
    processingTimeData: processingTimeService.getProcessingTimes(visaType),
    statsData: processingTimeService.getStatistics(visaType),
  });
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimeData, statsData } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Suspense fallback={<Skeleton className="h-[150px] w-full" />}>
        <Await resolve={statsData}>
          {(stats) => {
            return (
              <Statistics
                title="Global Statistics"
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
                    value: stats.slowest?.estimateTime ?? "N/A",
                    unit: stats.slowest?.countryName ?? "",
                    link: `/${visaType}/${stats.slowest?.countryCode}`,
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
