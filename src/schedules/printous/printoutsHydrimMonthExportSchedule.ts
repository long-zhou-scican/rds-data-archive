import { printoutsHydrimMonthService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsHydrimMonthService");
  if (exportArgs.length > 0) {
    console.warn("printoutsHydrimMonthService ignores configured export args; using default export()");
  }
  const result = await printoutsHydrimMonthService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_month. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
