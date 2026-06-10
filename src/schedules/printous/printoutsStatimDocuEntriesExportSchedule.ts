import { printoutsStatimDocuEntriesService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsStatimDocuEntriesService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_docu_entries. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
