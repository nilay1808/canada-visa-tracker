import {
  date,
  index,
  interval,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const processingTimesTable = pgTable(
  "processing_times",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: date("published_at", { mode: "date" }).notNull(),
    countryCode: text("country_code").notNull(),
    countryName: text("country_name"),
    visaType: text("visa_type").notNull(),
    estimateTime: text("estimate_time").notNull(),
    estimate: interval("estimate", {
      fields: "day",
    }),
  },
  (t) => ({
    unq: unique().on(t.countryCode, t.visaType, t.publishedAt),
    countryCodeVisaTypeIdx: index("country_code_visa_type_idx").on(
      t.countryCode,
      t.visaType
    ),
    visaTypePublishedAtIdx: index("visa_type_published_at_idx").on(
      t.visaType,
      t.publishedAt
    ),
  })
);
