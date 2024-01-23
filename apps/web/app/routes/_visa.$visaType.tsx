import type { LoaderFunctionArgs } from "@remix-run/node";
import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Statistics } from "../components/Statistics";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return json(
    {
      visaType,
      processingTimes: await processingTimeService.getProcessingTimes(visaType),
      stats: await processingTimeService.getStatistics(visaType),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimes, stats } = useLoaderData<typeof loader>();

  return (
    <>
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
            value: stats?.slowest?.estimateTime ?? "N/A",
            unit: stats?.slowest?.countryName ?? "",
            link: `/${visaType}/${stats?.slowest?.countryCode}`,
          },
        ]}
      />
      <div>
        <ProcessingTimeTable
          title="Processing Times Estimates"
          processingTimes={processingTimes ?? []}
        />
      </div>
    </>
  );
}
