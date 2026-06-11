import { reportsUploadService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await reportsUploadService.export(...getExportArgs("reportsUploadService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for reportsUpload. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
