import { LRUCache } from "lru-cache";
import { ProcessingTimeService } from "processing-time-service";

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 60 * 60 * 24 * 7, // 7 day in ms
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

export const processingTimeService = new ProcessingTimeService(cache);
