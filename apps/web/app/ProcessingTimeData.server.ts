import { ProcessingTimeService } from "processing-time-service";
import { prettyDateString } from "~/lib/utils";

export const processingTimeService = new ProcessingTimeService();

export async function getHistoricalProcessingTimes(
  visaType: string,
  countryCode: string
) {
  const processingTimeService = new ProcessingTimeService();
  const historicalProcessingTimes =
    await processingTimeService.getHistoricalProcessingTimes(
      visaType,
      countryCode
    );
  return historicalProcessingTimes.map((processingTime) => ({
    ...processingTime,
    publishedAt: prettyDateString(processingTime.publishedAt),
  }));
}
