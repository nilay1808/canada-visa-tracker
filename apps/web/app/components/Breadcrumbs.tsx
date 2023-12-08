import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { UIMatch } from "@remix-run/react";
import { Link, useMatches } from "@remix-run/react";
import { getInfoForVisaType } from "~/lib/VisaCategoryCodes";

function getBreadcrumbSegmentData(match: UIMatch) {
  if (match.id === "root") {
    return {
      name: "Home",
      url: "/",
    };
  } else if (match.id === "routes/visa.$visaType") {
    return {
      name: getInfoForVisaType(match.params.visaType!).title,
      url: `/visa/${match.params.visaType}`,
    };
  } else if (match.id === "routes/visa_.$visaType.$countryCode") {
    return {
      name: "Historical Processing Times",
      url: `/visa/${match.params.visaType}/${match.params.countryCode}`,
    };
  }
  throw new Error("Unknown match");
}

export function Breadcrumbs() {
  const matches = useMatches();
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        {matches.map((match, index) => {
          const { name, url } = getBreadcrumbSegmentData(match);
          return (
            <>
              <li>
                <Link
                  className="hover:text-gray-900 dark:hover:text-gray-50"
                  to={url}
                >
                  {name}
                </Link>
              </li>
              {index < matches.length - 1 && (
                <li>
                  <ChevronRightIcon className="w-4 h-4" />
                </li>
              )}
            </>
          );
        })}
      </ol>
    </nav>
  );
}
