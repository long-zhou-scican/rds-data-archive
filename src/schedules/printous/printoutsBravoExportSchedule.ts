import { printoutsBravoS3Service } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsBravoS3Service.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_bravo_s3. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
