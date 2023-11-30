import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { assertValidVisaCategoryCode } from "~/lib/VisaCategoryCodes";

export async function loader({ params }: LoaderFunctionArgs) {
  const { visaType, countryCode } = params;
  assertValidVisaCategoryCode(visaType);

  return {
    visaType,
    countryCode,
  };
}

export default function Page() {
  const { visaType, countryCode } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Visa Type: {visaType}</h1>
      <h1>Country Code: {countryCode}</h1>
    </div>
  );
}
