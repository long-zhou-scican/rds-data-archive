import { unitsDailyDetailSummaryService } from "datalayer";

async function main() {
  const s3Key = await unitsDailyDetailSummaryService.export();
  console.log(`✅ units_daily_detail_summary exported to ${s3Key}`);
}

main().catch(console.error);
