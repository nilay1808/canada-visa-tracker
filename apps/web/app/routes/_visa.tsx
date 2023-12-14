import { Outlet, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, defer } from "@remix-run/node";
import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { processingTimeService } from "../ProcessingTimeData.server";
import { prettyDateString } from "~/lib/utils";
import { getCountryName } from "~/lib/countryCodeToCountry";

export const meta: MetaFunction = ({ params }) => {
  const { visaType, countryCode } = params;

  let title = "Canada Visa Tracker";

  if (visaType) {
    title = `${title} | ${getInfoForVisaType(visaType).title}`;
  }

  const country = countryCode ? getCountryName(countryCode) : "";

  if (country) {
    title = `${title} - ${country}`;
  }

  return [{ title }];
};

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
  });
}

export default function VisaLayout() {
  const { visaType, publishedAt } = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumbs />
      <div className="w-full flex-col sm:flex-row inline-flex sm:items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {getInfoForVisaType(visaType).title} Visa Details
        </h1>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Updated on {prettyDateString(publishedAt)}
        </h3>
      </div>

      <Outlet />
    </>
  );
}
