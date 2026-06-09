import { printoutsStatimS3Service } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const keys = await printoutsStatimS3Service.export();
  console.log(`Scheduled statim export completed. Files: ${keys.length}`);

  return {
    message: "Scheduled printouts_statim export completed",
    keys,
  };
};
