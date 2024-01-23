import { defer, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";

import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { processingTimeService } from "../ProcessingTimeData.server";
import { Timeline } from "../components/Timeline";
import { getCountryName } from "~/lib/countryCodeToCountry";
import { HistoricalTimesChart } from "../components/HistoricalTimesChart";
import { Suspense } from "react";
import { Skeleton } from "../components/ui/skeleton";

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

  return defer(
    {
      imageUrl,
      visaType,
      countryCode,
      historicalDataPromise: processingTimeService.getHistoricalProcessingTimes(
        visaType,
        countryCode
      ),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
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
  const { countryCode, historicalDataPromise, visaType } =
    useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-200">
        Historical Data for {getCountryName(countryCode)}
      </h2>

      <Suspense fallback={<PageSuspense />}>
        <Await resolve={historicalDataPromise}>
          {(historicalData) => {
            const data = historicalData.map(
              ({ publishedAt, estimateTime }) => ({
                date: publishedAt,
                "Estimate Time": Number(estimateTime.split(" ")[0]),
              })
            );

            return (
              <>
                <HistoricalTimesChart
                  data={data}
                  valueUnit={historicalData.at(0)!.estimateTime.split(" ")[1]}
                />
                <div className="flex flex-col sm:flex-row gap-x-16 gap-y-8">
                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-2">
                      Interpreting this data
                    </h3>
                    <p className="text-gray-900 dark:text-gray-300">
                      The Canadian Govenment published updates to their
                      processing times on a weekly basis. However, this estimate
                      is just the average of the processing time taken for{" "}
                      <strong>
                        {getInfoForVisaType(visaType).title} Visas
                      </strong>{" "}
                      submitted in{" "}
                      <strong>{getCountryName(countryCode)}</strong> in the past
                      8 or 16 weeks.{" "}
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
                    <Timeline
                      timeline={historicalData
                        .map((item) => ({
                          updatedAt: item.publishedAt,
                          title: item.estimateTime,
                          description: `${
                            item.countryName ?? item.countryCode
                          } - ${getInfoForVisaType(item.visaType).title} Visa`,
                        }))
                        .reverse()}
                    />
                  </div>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

function PageSuspense() {
  //

  return (
    <>
      <Skeleton className="h-72 md:h-80 my-4" />
      <Skeleton className="w-full h-50vh my-4" />
    </>
  );
}
