import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./globals.css";
import { Navbar } from "./components/Navbar";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Footer } from "./components/Footer";

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

export default function App() {
  const [isDark, setIsDark] = useState(false);

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
        <Navbar
          checked={isDark}
          onCheckedChange={() => setIsDark((prev) => !prev)}
        />
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
