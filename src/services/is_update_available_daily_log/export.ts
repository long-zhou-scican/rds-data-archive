import { isUpdateAvailableDailyLogService } from "datalayer";

async function main() {
  const s3Key = await isUpdateAvailableDailyLogService.export();
  console.log(`✅ is_update_available_daily_log exported to ${s3Key}`);
}

main().catch(console.error);
