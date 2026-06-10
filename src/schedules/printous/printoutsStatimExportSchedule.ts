import { printoutsStatimS3Service } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsStatimS3Service.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_s3. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
