import { ProcessingTimeService } from "processing-time-service";

export async function getProcessingTimesDataForVisaType(visaType: string) {
  const processingTimeService = new ProcessingTimeService();
  const { publishedAt, processingTimes } =
    await processingTimeService.getLatestProcessingTimesForVisaType(visaType);
  return {
    publishedAt,
    processingTimes: processingTimes.map(
      ({ countryCode, countryName, estimateTime }) => {
        return {
          countryName: countryName ?? countryCode,
          estimateTime,
          historicalViewLink: `/visa/${visaType}/${countryCode}`,
        };
      }
    ),
  };
}

export function getHistoricalProcessingTimes(
  visaType: string,
  countryCode: string
) {
  const processingTimeService = new ProcessingTimeService();
  return processingTimeService.getHistoricalProcessingTimes(
    visaType,
    countryCode
  );
}
