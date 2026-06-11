import { auditLogService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await auditLogService.export(...getExportArgs("auditLogService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for audit_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
