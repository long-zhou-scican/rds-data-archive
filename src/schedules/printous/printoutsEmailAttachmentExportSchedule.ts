import { printoutsEmailAttachmentService } from "../../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await printoutsEmailAttachmentService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_email_attachment. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
