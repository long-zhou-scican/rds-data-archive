import { cycleReportsLogService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await cycleReportsLogService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for cycle_reports_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
