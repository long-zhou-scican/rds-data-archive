import { IsUpdateAvailableDailyLog, isUpdateAvailableDailyLogService } from "datalayer";

export async function queryAll(limit = 100): Promise<IsUpdateAvailableDailyLog[]> {
  return isUpdateAvailableDailyLogService.query<IsUpdateAvailableDailyLog>(`
    SELECT *
    FROM is_update_available_daily_log
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`is_update_available_daily_log rows: ${rows.length}`);
}

main().catch(console.error);
