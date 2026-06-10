import { printoutsMovedToArchivesService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsMovedToArchivesService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_moved_to_archives. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
