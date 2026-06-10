import { PrintoutEmailAttachmentRecovery, printoutsEmailAttachmentRecoveryService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutEmailAttachmentRecovery[]> {
  return printoutsEmailAttachmentRecoveryService.query<PrintoutEmailAttachmentRecovery>(`
    SELECT *
    FROM printouts_email_attachment_recovery
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_email_attachment_recovery rows: ${rows.length}`);
}

main().catch(console.error);
