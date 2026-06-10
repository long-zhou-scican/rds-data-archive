import { unitsOffsetsService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsOffsetsService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_offsets. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
