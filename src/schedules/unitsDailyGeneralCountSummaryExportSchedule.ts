import { unitsDailyGeneralCountSummaryService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsDailyGeneralCountSummaryService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_daily_general_count_summary. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
