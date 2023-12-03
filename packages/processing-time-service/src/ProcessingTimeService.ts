import { eq, and, desc } from "drizzle-orm";

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

          const estimateTime = categoryData[countryCode] as string;

          if (estimateTime === "No processing time available") {
            return;
          }

          return {
            countryCode,
            countryName: countryCodeToName[countryCode],
            visaType,
            estimateTime,
            publishedAt,
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
      );

    return {
      publishedAt,
      processingTimes: processingTimesData.map(
        ({ countryCode, countryName, estimateTime }) => ({
          countryCode,
          countryName: countryName ?? countryCode,
          estimateTime,
        })
      ),
    };
  }
}

function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}
