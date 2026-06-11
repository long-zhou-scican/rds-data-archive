import { unitsCfNotificationsService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsCfNotificationsService.export(...getExportArgs("unitsCfNotificationsService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_cf_notifications. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
