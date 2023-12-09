import { eq, and, desc, max, asc } from "drizzle-orm";

import { db, processingTimesTable } from "database";

export interface RawProcessingTimeData {
  child_adopted: Record<string, string>;
  child_dependent: Record<string, string>;
  refugees_gov: Record<string, string>;
  refugees_private: Record<
    string,
    {
      sponsor: string;
      refugee: string;
    }
  >;
  study: Record<string, string>;
  supervisa: Record<string, string>;
  "visitor-outside-canada": Record<string, string>;
  work: Record<string, string>;
}

export class ProcessingTimeService {
  constructor() {}

  async saveAllProcessingTimes(
    processingTimes: RawProcessingTimeData,
    countryCodeToName: Record<string, string>
  ) {
    const processingTimesArray = Object.keys(processingTimes)
      .flatMap((visaType) => {
        const categoryData =
          processingTimes[visaType as keyof RawProcessingTimeData];

        const publishedAt = categoryData["lastupdated"] as string;

        return Object.keys(categoryData).map((countryCode) => {
          if (visaType === "refugees_private") {
            return;
          }

          if (countryCode === "lastupdated") {
            return;
          }

          const estimateTime = categoryData[countryCode] as string;

          if (
            estimateTime === "No processing time available" ||
            estimateTime === "Not enough data"
          ) {
            return;
          }

          const countryName =
            countryCode in countryCodeToName
              ? countryCodeToName[countryCode].replace("&rsquo;", "'")
              : undefined;

          return {
            countryCode,
            countryName,
            visaType,
            estimateTime,
            publishedAt: new Date(publishedAt),
            estimate: estimateTime,
          };
        });
      })
      .filter(isNotNull);

    await db
      .insert(processingTimesTable)
      .values(processingTimesArray)
      .onConflictDoNothing()
      .returning();
  }

  async getLatestPublishedAt(visaType: string) {
    const [{ publishedAt }] = await db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1);

    return publishedAt;
  }

  async getStatistics(visaType: string, publishedAt: Date) {
    const results = await db
      .select({
        countryCode: processingTimesTable.countryCode,
        countryName: processingTimesTable.countryName,
        estimateTime: processingTimesTable.estimateTime,
      })
      .from(processingTimesTable)
      .where(
        and(
          eq(processingTimesTable.visaType, visaType),
          eq(processingTimesTable.publishedAt, publishedAt)
        )
      )
      .orderBy(asc(processingTimesTable.estimate));

    const length = results.length;

    const fastest = results[0];
    const slowest = results[length - 1];
    const median = results[Math.floor(length / 2)];

    return {
      fastest,
      slowest,
      median,
    };
  }

  async getProcessingTimes(visaType: string, publishedAt: Date) {
    const processingTimesData = await db
      .select({
        countryCode: processingTimesTable.countryCode,
        countryName: processingTimesTable.countryName,
        estimateTime: processingTimesTable.estimateTime,
      })
      .from(processingTimesTable)
      .where(
        and(
          eq(processingTimesTable.visaType, visaType),
          eq(processingTimesTable.publishedAt, publishedAt)
        )
      )
      .orderBy(processingTimesTable.countryName);

    return processingTimesData.map(
      ({ countryCode, countryName, estimateTime }) => ({
        countryName: countryName ?? countryCode,
        estimateTime,
        visaType,
        historicalViewLink: `/${visaType}/${countryCode}`,
      })
    );
  }

  async getHistoricalProcessingTimes(visaType: string, countryCode: string) {
    const data = await db
      .select({
        publishedAt: processingTimesTable.publishedAt,
        estimateTime: processingTimesTable.estimateTime,
        countryName: processingTimesTable.countryName,
        countryCode: processingTimesTable.countryCode,
        visaType: processingTimesTable.visaType,
      })
      .from(processingTimesTable)
      .where(
        and(
          eq(processingTimesTable.visaType, visaType),
          eq(processingTimesTable.countryCode, countryCode)
        )
      )
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(12);

    return data;
  }
}

function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}
