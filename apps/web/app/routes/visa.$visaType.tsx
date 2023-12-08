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
import { getProcessingTimesDataForVisaType } from "../ProcessingTimeData.server";
import { Breadcrumbs } from "../components/Breadcrumbs";

export async function loader({ params }: LoaderFunctionArgs) {
  const visaType = params.visaType;
  assertValidVisaCategoryCode(visaType);

  return defer({
    visaType,
    processingTimeData: getProcessingTimesDataForVisaType(visaType),
  });
}

export default function VisaProcessingTimes() {
  const { visaType, processingTimeData } = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumbs />
      <Suspense fallback={<Skeleton className="h-[700px] w-full" />}>
        <Await resolve={processingTimeData}>
          {({ publishedAt, processingTimes }) => (
            <div>
              <ProcessingTimeTable
                title={`Latest Processing Times for ${
                  getInfoForVisaType(visaType).title
                } Visa`}
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
