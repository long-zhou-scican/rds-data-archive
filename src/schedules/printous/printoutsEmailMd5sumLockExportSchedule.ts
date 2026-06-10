import { printoutsEmailMd5sumLockService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsEmailMd5sumLockService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_email_md5sum_lock. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
