import { isupdatesAvailableLogService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await isupdatesAvailableLogService.export(...getExportArgs("isupdatesAvailableLogService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for isupdates_available_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
