import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
import { HistoricalTimesChart } from "../components/HistoricalTimesChart";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;
  assertValidVisaCategoryCode(visaType);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  if (countryCode !== countryCode.toUpperCase()) {
    return redirect(`/${visaType}/${countryCode.toUpperCase()}`);
  }

  const imageUrl = new URL(
    `/image/${visaType}/${countryCode}.png`,
    request.url
  ).toString();

  return {
    imageUrl,
    visaType,
    countryCode,
    historicalData: await processingTimeService.getHistoricalProcessingTimes(
      visaType,
      countryCode
    ),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []).reverse()[0];

  return [
    parentMeta,
    {
      property: "og:image",
      content: data?.imageUrl,
    },
  ];
};

export default function Page() {
  const { countryCode, historicalData, visaType } =
    useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-200">
        Historical Data for {getCountryName(countryCode)}
      </h2>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <Await resolve={historicalData}>
          {(timelineData) => {
            const data = timelineData.map(({ publishedAt, estimateTime }) => ({
              date: prettyDateString(publishedAt),
              "Estimate Time": Number(estimateTime.split(" ")[0]),
            }));
            return (
              <HistoricalTimesChart
                data={data}
                valueUnit={timelineData.at(0)!.estimateTime.split(" ")[1]}
              />
            );
          }}
        </Await>
      </Suspense>

      <div className="flex flex-col sm:flex-row gap-x-16 gap-y-8">
        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">Interpreting this data</h3>
          <p className="text-gray-900 dark:text-gray-300">
            The Canadian Govenment published updates to their processing times
            on a weekly basis. However, this estimate is just the average of the
            processing time taken for{" "}
            <strong>{getInfoForVisaType(visaType).title} Visas</strong>{" "}
            submitted in <strong>{getCountryName(countryCode)}</strong> in the
            past 8 or 16 weeks.{" "}
            <a
              className="text-blue-500 hover:underline"
              href="https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1619&top=3"
            >
              [source]
            </a>
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
