import { printoutsHydrimDocuEntriesNoteService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsHydrimDocuEntriesNoteService");
  if (exportArgs.length > 0) {
    console.warn("printoutsHydrimDocuEntriesNoteService ignores configured export args; using default export()");
  }
  const result = await printoutsHydrimDocuEntriesNoteService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_docu_entries_note. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
