import { printoutsMovedToArchivesService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsMovedToArchivesService");
  if (exportArgs.length > 0) {
    console.warn("printoutsMovedToArchivesService ignores configured export args; using default export()");
  }
  const result = await printoutsMovedToArchivesService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_moved_to_archives. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
