import { printoutsStatimDocuEntriesNoteService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsStatimDocuEntriesNoteService.export(...getExportArgs("printoutsStatimDocuEntriesNoteService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_docu_entries_note. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
