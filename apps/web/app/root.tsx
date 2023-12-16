import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import styles from "./globals.css";
import { Navbar } from "./components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { pageview } from "~/lib/gtags.client";
import { Footer } from "./components/Footer";
import {
  getDarkModeValueFromLocalStorage,
  setDarkModeValueInLocalStorage,
} from "./components/DarkMode.client";
import posthog from "posthog-js";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [
    { title: "Canada Visa Tracker" },
    {
      name: "description",
      content:
        "Unofficial tracker for processing times for different Canadian Visas",
    },
  ];
};

// Load the GA tracking id from the .env
export const loader = async () => {
  return json({
    gaTrackingId: process.env.GA_TRACKING_ID,
    posthotToken: process.env.POSTHOG_TOKEN,
  });
};

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getDarkModeValueFromLocalStorage());
  }, []);

  const onCheckedChange = useCallback(() => {
    setDarkModeValueInLocalStorage(!isDark);
    setIsDark((prev) => !prev);
  }, [isDark]);

  const location = useLocation();
  const { gaTrackingId, posthotToken } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    if (posthotToken) {
      posthog.init(posthotToken, {
        api_host: "https://app.posthog.com",
        capture_pageview: false,
      });
    }
  }, [posthotToken]);

  useEffect(() => {
    if (posthotToken) {
      console.log("pageview", location.pathname);
      posthog.capture("$pageview");
    }
  }, [location, posthotToken]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={cn("flex flex-col min-h-screen", {
          dark: isDark,
        })}
      >
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}

        <Navbar checked={isDark} onCheckedChange={onCheckedChange} />
        <div className="container">
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
