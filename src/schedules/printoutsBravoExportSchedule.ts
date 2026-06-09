import { printoutsBravoS3Service } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const keys = await printoutsBravoS3Service.export();
  console.log(`Scheduled export completed. Files: ${keys.length}`);

  return {
    message: "Scheduled printouts_bravo export completed",
    keys,
  };
};
