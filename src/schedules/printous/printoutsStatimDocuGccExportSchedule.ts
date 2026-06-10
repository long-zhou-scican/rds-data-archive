import { printoutsStatimDocuGccService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsStatimDocuGccService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_docu_gcc. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
