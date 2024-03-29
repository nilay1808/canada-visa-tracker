import { eq, and, desc } from "drizzle-orm";
import { processingTimesTable } from "./schema";
import { db } from "./database";
import { LRUCache } from "lru-cache";

export interface RawProcessingTimeData {
  child_adopted: Record<string, string>;
  child_dependent: Record<string, string>;
  refugees_gov: Record<string, string>;
  refugees_private: Record<
    string,
    | {
        sponsor: string;
        refugee: string;
      }
    | string
  >;
  study: Record<string, string>;
  supervisa: Record<string, string>;
  "visitor-outside-canada": Record<string, string>;
  work: Record<string, string>;
}

export class ProcessingTimeService {
  constructor(private readonly cache?: LRUCache<string, any>) {}

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

    const result = await db
      .insert(processingTimesTable)
      .values(processingTimesArray)
      .onConflictDoNothing()
      .returning();

    if (result.length > 0) {
      this.cache?.clear();
    }
  }

  async getLatestPublishedAt(visaType: string) {
    const cachedValue = this.cache?.get(`latestPublishedAt-${visaType}`);

    if (cachedValue) {
      return cachedValue;
    }

    const [result] = await db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1);

    const dateString = prettyDateString(result?.publishedAt);
    this.cache?.set(`latestPublishedAt-${visaType}`, dateString);
    return dateString;
  }

  async getLatestProcessingTimes(visaType: string, countryCode: string) {
    const [result] = await db
      .select({
        estimateTime: processingTimesTable.estimateTime,
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(
        and(
          eq(processingTimesTable.visaType, visaType),
          eq(processingTimesTable.countryCode, countryCode)
        )
      )
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1);

    return result
      ? {
          estimateTime: result.estimateTime,
          publishedAt: prettyDateString(result.publishedAt),
        }
      : undefined;
  }

  async getStatistics(visaType: string) {
    const cachedValue = this.cache?.get(`statistics-${visaType}`);

    if (cachedValue) {
      return cachedValue;
    }

    const latestProcessingTime = db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1)
      .as("latestProcessingTime");

    const results = await db
      .select({
        countryCode: processingTimesTable.countryCode,
        countryName: processingTimesTable.countryName,
        estimateTime: processingTimesTable.estimateTime,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .rightJoin(
        latestProcessingTime,
        eq(processingTimesTable.publishedAt, latestProcessingTime.publishedAt)
      )
      .orderBy(processingTimesTable.estimate);

    const length = results.length;

    const fastest = results[0];
    const slowest = results[length - 1];
    const median = results[Math.floor(length / 2)];

    this.cache?.set(`statistics-${visaType}`, {
      fastest,
      slowest,
      median,
    });

    return {
      fastest,
      slowest,
      median,
    };
  }

  async getProcessingTimes(visaType: string): Promise<
    {
      estimateTime: string;
      countryName: string;
      historicalViewLink: string;
    }[]
  > {
    const cachedValue = this.cache?.get(`processingTimes-${visaType}`);

    if (cachedValue) {
      return cachedValue;
    }

    const latestProcessingTime = db
      .select({
        publishedAt: processingTimesTable.publishedAt,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .orderBy(desc(processingTimesTable.publishedAt))
      .limit(1)
      .as("latestProcessingTime");

    const processingTimesData = await db
      .select({
        countryCode: processingTimesTable.countryCode,
        countryName: processingTimesTable.countryName,
        estimateTime: processingTimesTable.estimateTime,
      })
      .from(processingTimesTable)
      .where(eq(processingTimesTable.visaType, visaType))
      .rightJoin(
        latestProcessingTime,
        eq(processingTimesTable.publishedAt, latestProcessingTime.publishedAt)
      )
      .orderBy(processingTimesTable.countryName);

    const result = processingTimesData
      .map((data) => {
        const { countryCode, countryName, estimateTime } = data;

        if (countryCode == null || estimateTime == null) {
          return;
        }

        return {
          countryName: countryName ?? countryCode,
          estimateTime,
          historicalViewLink: `/${visaType}/${countryCode}`,
        };
      })
      .filter(isNotNull);

    this.cache?.set(`processingTimes-${visaType}`, result);

    return result;
  }

  async getHistoricalProcessingTimes(
    visaType: string,
    countryCode: string
  ): Promise<
    {
      publishedAt: string;
      estimateTime: string;
      countryCode: string;
      countryName: string | null;
      visaType: string;
    }[]
  > {
    const cachedValue = this.cache?.get(
      `historicalProcessingTimes-${visaType}-${countryCode}`
    );
    if (cachedValue) {
      return cachedValue;
    }

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

    data.sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

    const result = data.map(
      ({ publishedAt, estimateTime, countryCode, countryName, visaType }) => ({
        publishedAt: prettyDateString(publishedAt)!,
        estimateTime,
        countryCode,
        countryName,
        visaType,
      })
    );

    this.cache?.set(
      `historicalProcessingTimes-${visaType}-${countryCode}`,
      result
    );

    return result;
  }
}

function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}

function prettyDateString(rawDate: Date) {
  if (rawDate == null) {
    return;
  }

  const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate;
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    timeZoneName: "shortGeneric",
  };

  return date.toLocaleDateString("en-US", options);
}
