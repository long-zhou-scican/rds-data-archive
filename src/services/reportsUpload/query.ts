import { Reportsupload, reportsUploadService } from "datalayer";

export async function queryAll(limit = 100): Promise<Reportsupload[]> {
  return reportsUploadService.query<Reportsupload>(`
    SELECT *
    FROM reportsUpload
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`reportsUpload rows: ${rows.length}`);
}

main().catch(console.error);
