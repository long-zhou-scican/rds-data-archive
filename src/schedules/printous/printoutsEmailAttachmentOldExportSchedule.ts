import { printoutsEmailAttachmentOldService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsEmailAttachmentOldService.export(...getExportArgs("printoutsEmailAttachmentOldService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_email_attachment_old. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
