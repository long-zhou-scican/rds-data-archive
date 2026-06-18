import { unitsCfNotificationsService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("unitsCfNotificationsService");
  if (exportArgs.length > 0) {
    console.warn("unitsCfNotificationsService ignores configured export args; using default export()");
  }
  const result = await unitsCfNotificationsService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_cf_notifications. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
