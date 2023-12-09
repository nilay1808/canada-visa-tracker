import { ProcessingTimeService } from "processing-time-service";

export async function getProcessingTimesDataForVisaType(visaType: string) {
  const processingTimeService = new ProcessingTimeService();
  const { publishedAt, processingTimes } =
    await processingTimeService.getLatestProcessingTimesForVisaType(visaType);
  return {
    publishedAt: prettyDateString(new Date(publishedAt)),
    processingTimes: processingTimes.map(
      ({ countryCode, countryName, estimateTime }) => {
        return {
          countryName: countryName ?? countryCode,
          estimateTime,
          historicalViewLink: `/${visaType}/${countryCode}`,
        };
      }
    ),
  };
}

export async function getLatestStatsForVisaType(visaType: string) {
  const processingTimeService = new ProcessingTimeService();
  return await processingTimeService.getLatestStatsForVisaType(visaType);
}

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

function prettyDateString(date: Date) {
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
