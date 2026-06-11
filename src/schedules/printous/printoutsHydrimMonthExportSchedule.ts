import { printoutsHydrimMonthService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsHydrimMonthService.export(...getExportArgs("printoutsHydrimMonthService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_month. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
