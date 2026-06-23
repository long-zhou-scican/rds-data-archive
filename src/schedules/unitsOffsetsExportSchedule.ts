import { unitsOffsetsService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("unitsOffsetsService");
  if (exportArgs.length > 0) {
    console.warn("unitsOffsetsService ignores configured export args; using default export()");
  }
  console.log(`Starting scheduled export for units_offsets with args: ${JSON.stringify(exportArgs)}`);
  const result = await unitsOffsetsService.exportBySerialNumber(exportArgs[0], true, );
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_offsets. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
