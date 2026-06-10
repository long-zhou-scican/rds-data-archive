import { PrintoutEmailAttachmentOld, printoutsEmailAttachmentOldService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutEmailAttachmentOld[]> {
  return printoutsEmailAttachmentOldService.query<PrintoutEmailAttachmentOld>(`
    SELECT *
    FROM printouts_email_attachment_old
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_email_attachment_old rows: ${rows.length}`);
}

main().catch(console.error);
