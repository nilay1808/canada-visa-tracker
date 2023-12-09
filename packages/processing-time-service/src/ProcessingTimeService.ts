import { eq, and, desc, max, asc } from "drizzle-orm";

import { db, processingTimesTable } from "database";
import { sql } from "drizzle-orm";

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

  async getLatestStatsForVisaType(visaType: string) {
    // Latest published at for the visa type
    const [{ publishedAt }] = await db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1);

    const baseQuery = db
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
      );

    const fastest = await baseQuery
      .orderBy(asc(processingTimesTable.estimate))
      .limit(1);

    const slowest = await baseQuery
      .orderBy(desc(processingTimesTable.estimate))
      .limit(1);

    const average = await db
      .select({
        estimateTime: sql`avg(${processingTimesTable.estimate})`,
      })
      .from(processingTimesTable)
      .where(
        and(
          eq(processingTimesTable.visaType, visaType),
          eq(processingTimesTable.publishedAt, publishedAt)
        )
      )
      .limit(1);

    return {
      publishedAt: publishedAt.toLocaleDateString(),
      fastest: fastest[0],
      slowest: slowest[0],
      average: average[0],
    };
  }

  async getLatestProcessingTimesForVisaType(visaType: string) {
    // Latest published at for the visa type
    const [{ publishedAt }] = await db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1);

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

    return {
      publishedAt: publishedAt.toLocaleDateString(),
      processingTimes: processingTimesData.map(
        ({ countryCode, countryName, estimateTime }) => ({
          countryCode,
          countryName: countryName ?? countryCode,
          estimateTime,
          visaType,
        })
      ),
    };
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
      .orderBy(desc(processingTimesTable.publishedAt));

    return data;
  }
}

function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}
