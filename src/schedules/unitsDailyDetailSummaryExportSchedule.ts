import { unitsDailyDetailSummaryService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsDailyDetailSummaryService.export(...getExportArgs("unitsDailyDetailSummaryService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_daily_detail_summary. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
