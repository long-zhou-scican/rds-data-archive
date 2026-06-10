import { printoutsEmailAttachmentService } from "datalayer";

async function main() {
  const s3Key = await printoutsEmailAttachmentService.export();
  console.log(`✅ printouts_email_attachment exported to ${s3Key}`);
}

main().catch(console.error);
