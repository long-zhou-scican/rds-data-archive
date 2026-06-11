import { auditLogService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const whereSql = "1=1"; //"timestamp <= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 5 YEAR))";
  const result = await auditLogService.export( whereSql, "timestamp", true,  true, true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for audit_log. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
