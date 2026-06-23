import { printoutsFaultyDataService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsFaultyDataService");
  if (exportArgs.length > 0) {
    console.warn("printoutsFaultyDataService ignores configured export args; using default export()");
  }
  const result = await printoutsFaultyDataService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_faulty_data. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
