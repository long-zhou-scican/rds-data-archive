import { unitsDailyDetailSummaryService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("unitsDailyDetailSummaryService");
  if (!exportArgs) {
    console.log("No export arguments found for unitsDailyDetailSummaryService. Skipping export.");
    return {
      message: "No export arguments found. Skipping export.",
      keys: [],
    };
  }
  const result = await unitsDailyDetailSummaryService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_daily_detail_summary. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
