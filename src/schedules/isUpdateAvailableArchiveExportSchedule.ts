import { isUpdateAvailableArchiveService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("isUpdateAvailableArchiveService");
  if (exportArgs.length > 0) {
    console.warn("isUpdateAvailableArchiveService ignores configured export args; using default export()");
  }
  const result = await isUpdateAvailableArchiveService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for is_update_available_archive. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
