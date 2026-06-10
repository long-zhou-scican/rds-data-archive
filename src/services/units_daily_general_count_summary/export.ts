import { unitsDailyGeneralCountSummaryService } from "datalayer";

async function main() {
  const s3Key = await unitsDailyGeneralCountSummaryService.export();
  console.log(`✅ units_daily_general_count_summary exported to ${s3Key}`);
}

main().catch(console.error);
