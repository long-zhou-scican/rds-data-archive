import { cycleReportsLogService } from "datalayer";

async function main() {
  const s3Key = await cycleReportsLogService.export();
  console.log(`✅ cycle_reports_log exported to ${s3Key}`);
}

main().catch(console.error);
