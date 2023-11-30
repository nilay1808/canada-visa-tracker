import type { LoaderFunctionArgs } from "@remix-run/node";
import type { VisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { defer } from "@remix-run/node";

async function getProcessingTimes(visaType: VisaCategoryCode) {
  const [processingTimeReq, countryCodeToNameReq] = await Promise.all([
    fetch(
      "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json"
    ),
    fetch(
      "https://www.canada.ca/content/dam/ircc/documents/json/data-country-name-en.json"
    ),
  ]);

  const [processingTime, countryCodeToNameObj] = await Promise.all([
    processingTimeReq.json(),
    countryCodeToNameReq.json(),
  ]);

  const workPermitProcessingTimes: Record<string, string> =
    processingTime[visaType];

  const countryCodeToName: Record<string, string> =
    countryCodeToNameObj["country-name"];

  const lastUpdated = workPermitProcessingTimes["lastupdated"];

  return {
    processingTimes: Object.entries(workPermitProcessingTimes).map(
      ([countryCode, processingTime]) => ({
        countryCode,
        countryName: countryCodeToName[countryCode],
        processingTime,
      })
    ),
    lastUpdated,
  };
}

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return defer({
    visaType,
    processingTimeData: getProcessingTimes(visaType),
  });
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimeData } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <Await resolve={processingTimeData}>
        {({ lastUpdated, processingTimes }) => (
          <div>
            <ProcessingTimeTable
              title={`Processing Times for ${visaType} visa`}
              lastUpdated={lastUpdated}
              processingTimes={processingTimes}
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
}
