import { printoutsHydrimAdtService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsHydrimAdtService.export(...getExportArgs("printoutsHydrimAdtService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_adt. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
