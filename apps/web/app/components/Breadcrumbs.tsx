import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Link, useLocation } from "@remix-run/react";
import type { VisaType } from "~/lib/VisaCategoryCodes";
import { getInfoForVisaType, visaTypes } from "~/lib/VisaCategoryCodes";
import { getCountryName } from "~/lib/countryCodeToCountry";

function segmentToName(segment: string) {
  if (visaTypes.includes(segment as VisaType)) {
    return getInfoForVisaType(segment).title;
  }

  return getCountryName(segment);
}

function getBreadcrumbSegmentData(currentPath: string) {
  const pathSegments = currentPath.split("/");

  const breadcrumbsPath = [
    {
      name: "Home",
      url: "/",
    },
  ];

  pathSegments.forEach((segment, index) => {
    if (segment === "") {
      return;
    }

    const url = `${breadcrumbsPath[index - 1]?.url ?? ""}${segment}/`;

    breadcrumbsPath.push({
      name: segmentToName(segment),
      url,
    });
  });

  return breadcrumbsPath;
}

export function Breadcrumbs() {
  const location = useLocation();

  const paths = getBreadcrumbSegmentData(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        {paths.map((path, index) => {
          const { name, url } = path;

          const isLast = index === paths.length - 1;

          return (
            <li className="flex items-center" key={`link-${index}`}>
              <Link
                className="hover:text-gray-950 dark:hover:text-gray-50 mr-2"
                to={isLast ? "#" : url}
              >
                {name}
              </Link>
              {!isLast && <ChevronRightIcon className="w-4 h-4 mr-2" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
