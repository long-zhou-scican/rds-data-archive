import { printoutsEmailAttachmentOldService } from "datalayer";

async function main() {
  const s3Key = await printoutsEmailAttachmentOldService.export();
  console.log(`✅ printouts_email_attachment_old exported to ${s3Key}`);
}

main().catch(console.error);
