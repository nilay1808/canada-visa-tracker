# 🇨🇦 Canada Visa Tracker

## Introduction

This is a simple web application to track the processing times for different Canadian visas. It shows the same information as the [official tool](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html), but I hope for it to be faster, easier to use, and a few added features such as showing historical data.

## Technical Overview

- The webapp everyone sees and interacts with is built using [Remix](https://remix.run/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/).
- There's also a very barebones cron job that fetches JSON data that powers the [Official Canadian Government website](https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json) and stores it in a database.
- Both of these services share the same Postgres database and use [Drizzle ORM](https://orm.drizzle.team/) to interact with it.
- The entire repository which is a monorepo is powered by Turborepo and PNPM workspaces.
- Lastly, all the services are hosted on [Railway](https://railway.app/).

## Development

Getting started should be easy, you will need Node.js 18+, PNPM, and a Postgres database.

1. Make a `.env` file in the root similar to `.env.example` and fill in the values.
2. Install dependencies using `pnpm i`.
3. Start the dev server with `pnpm dev`.
