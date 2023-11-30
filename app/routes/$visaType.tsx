import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";
import { ProcessingTimeTable } from "../components/ProcessingTimesTable";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

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
    visaType,
  };
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimes, lastUpdated } =
    useLoaderData<typeof loader>();

  return (
    <ProcessingTimeTable
      title={`Processing Times for ${visaType} visa`}
      lastUpdated={lastUpdated}
      processingTimes={processingTimes}
    />
  );
}
