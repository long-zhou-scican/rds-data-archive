import { unitsOffsetsService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsOffsetsService.export(...getExportArgs("unitsOffsetsService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_offsets. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
