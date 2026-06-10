import { IsupdateAvailableLog, isupdatesAvailableLogService } from "datalayer";

export async function queryAll(limit = 100): Promise<IsupdateAvailableLog[]> {
  return isupdatesAvailableLogService.query<IsupdateAvailableLog>(`
    SELECT *
    FROM isupdates_available_log
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`isupdates_available_log rows: ${rows.length}`);
}

main().catch(console.error);
