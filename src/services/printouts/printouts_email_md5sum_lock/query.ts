import { PrintoutEmailMd5sumLock, printoutsEmailMd5sumLockService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutEmailMd5sumLock[]> {
  return printoutsEmailMd5sumLockService.query<PrintoutEmailMd5sumLock>(`
    SELECT *
    FROM printouts_email_md5sum_lock
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_email_md5sum_lock rows: ${rows.length}`);
}

main().catch(console.error);
