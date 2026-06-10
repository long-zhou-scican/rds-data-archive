import { printoutsStatimMonthService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsStatimMonthService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_month. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
