import { ProcessingTimeService } from "processing-time-service";

export function getProcessingTimeData(visaType: string) {
  const processingTimeService = new ProcessingTimeService();

  return processingTimeService.getLatestProcessingTimesForVisaType(visaType);
}
