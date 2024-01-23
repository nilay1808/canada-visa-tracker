import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { ImageResponse } from "@vercel/og";
import {
  assertValidVisaCategoryCode,
  getInfoForVisaType,
} from "~/lib/VisaCategoryCodes";
import { getCountryName } from "~/lib/countryCodeToCountry";
import { processingTimeService } from "../ProcessingTimeData.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;

  assertValidVisaCategoryCode(visaType);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  if (countryCode !== countryCode.toUpperCase()) {
    return redirect(`/image/${visaType}/${countryCode.toUpperCase()}`);
  }

  const result = await processingTimeService.getLatestProcessingTimes(
    visaType,
    countryCode
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: 78,
        }}
      >
        Canada Visa Tracker
      </h1>
      <h2
        style={{
          fontSize: 48,
        }}
      >
        {getInfoForVisaType(visaType).title} Visa from{" "}
        {getCountryName(countryCode)}: {result!.estimateTime}
      </h2>
      <p
        style={{
          fontSize: 36,
        }}
      >
        Last Updated: {result!.publishedAt}
      </p>
    </div>
  );
}
