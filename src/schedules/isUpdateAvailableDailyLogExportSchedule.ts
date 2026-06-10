import { isUpdateAvailableDailyLogService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await isUpdateAvailableDailyLogService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for is_update_available_daily_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
