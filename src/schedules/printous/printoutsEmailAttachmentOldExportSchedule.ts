import { printoutsEmailAttachmentOldService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsEmailAttachmentOldService");
  if (exportArgs.length > 0) {
    console.warn("printoutsEmailAttachmentOldService ignores configured export args; using default export()");
  }
  const result = await printoutsEmailAttachmentOldService.exportBySerialNumber(exportArgs[0], true, 'serial_number');
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_email_attachment_old. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
