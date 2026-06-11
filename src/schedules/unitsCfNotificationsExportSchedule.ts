import { unitsCfNotificationsService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const whereSql =  "date_originated <= DATE_SUB(NOW(), INTERVAL 5 YEAR)";
  const result = await unitsCfNotificationsService.export(whereSql, "date_originated", true, false, false);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_cf_notifications. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
