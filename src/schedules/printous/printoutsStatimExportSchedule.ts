import { printoutsStatimS3Service } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsStatimS3Service");
  if (exportArgs.length > 0) {
    console.warn("printoutsStatimS3Service ignores configured export args; using default export()");
  }
  const result = await printoutsStatimS3Service.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_s3. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
