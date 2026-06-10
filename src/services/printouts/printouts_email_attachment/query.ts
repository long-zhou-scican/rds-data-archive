import { PrintoutEmailAttachment, printoutsEmailAttachmentService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutEmailAttachment[]> {
  return printoutsEmailAttachmentService.query<PrintoutEmailAttachment>(`
    SELECT *
    FROM printouts_email_attachment
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_email_attachment rows: ${rows.length}`);
}

main().catch(console.error);
