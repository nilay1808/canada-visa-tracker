import {
  ProcessingTimeService,
  RawProcessingTimeData,
} from "processing-time-service";

async function main() {
  console.log("Cron job started");

  const [processingTimeReq, countryCodeToNameReq] = await Promise.all([
    fetch(
      "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json"
    ),
    fetch(
      "https://www.canada.ca/content/dam/ircc/documents/json/data-country-name-en.json"
    ),
  ]);

  const [processingTime, countryCodeToNameObj] = await Promise.all([
    processingTimeReq.json(),
    countryCodeToNameReq.json(),
  ]);

  const processingTimeService = new ProcessingTimeService();

  // await processingTimeService.saveAllProcessingTimes(
  //   processingTime as RawProcessingTimeData,
  //   (countryCodeToNameObj as Record<string, Record<string, string>>)[
  //     "country-name"
  //   ] as Record<string, string>
  // );

  console.log("Cron job finished");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
