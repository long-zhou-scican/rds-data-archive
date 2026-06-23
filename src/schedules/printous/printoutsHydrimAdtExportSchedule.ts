import { printoutsHydrimAdtService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsHydrimAdtService");
  if (exportArgs.length > 0) {
    console.warn("printoutsHydrimAdtService ignores configured export args; using default export()");
  }
  const result = await printoutsHydrimAdtService.exportBySerialNumber(exportArgs[0], true, );
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_adt. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
