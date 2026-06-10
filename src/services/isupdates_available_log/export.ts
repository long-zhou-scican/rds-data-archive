import { isupdatesAvailableLogService } from "datalayer";

async function main() {
  const s3Key = await isupdatesAvailableLogService.export();
  console.log(`✅ isupdates_available_log exported to ${s3Key}`);
}

main().catch(console.error);
