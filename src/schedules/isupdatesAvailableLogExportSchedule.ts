import { isupdatesAvailableLogService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("isupdatesAvailableLogService");
  if (exportArgs.length > 0) {
    console.warn("isupdatesAvailableLogService ignores configured export args; using default export()");
  }
  const result = await isupdatesAvailableLogService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for isupdates_available_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
