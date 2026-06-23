import { printoutsStatimAdtService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsStatimAdtService");
  if (exportArgs.length === 0) {
    console.warn("No export args configured for printoutsStatimAdtService; using default export()");
  }
  const result = await printoutsStatimAdtService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_adt. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
