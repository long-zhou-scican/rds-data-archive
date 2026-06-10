import { printoutsEmailAttachmentRecoveryService } from "datalayer";

async function main() {
  const s3Key = await printoutsEmailAttachmentRecoveryService.export();
  console.log(`✅ printouts_email_attachment_recovery exported to ${s3Key}`);
}

main().catch(console.error);
