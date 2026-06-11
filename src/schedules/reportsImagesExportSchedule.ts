import { reportsImagesService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await reportsImagesService.export(...getExportArgs("reportsImagesService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for reports_images. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
