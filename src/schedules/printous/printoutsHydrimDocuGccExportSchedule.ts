import { printoutsHydrimDocuGccService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsHydrimDocuGccService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_hydrim_docu_gcc. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
