import { printoutsBravoS3Service } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsBravoS3Service");
  if (exportArgs.length > 0) {
    console.warn("printoutsBravoS3Service ignores configured export args; using default export()");
  }
  const result = await printoutsBravoS3Service.exportBySerialNumber();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_bravo_s3. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
