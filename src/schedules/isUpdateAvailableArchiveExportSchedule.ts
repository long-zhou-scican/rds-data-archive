import { isUpdateAvailableArchiveService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await isUpdateAvailableArchiveService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for is_update_available_archive. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
