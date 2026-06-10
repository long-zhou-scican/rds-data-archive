import { unitsCfNotificationsService } from "datalayer";

async function main() {
  const s3Key = await unitsCfNotificationsService.export();
  console.log(`✅ units_cf_notifications exported to ${s3Key}`);
}

main().catch(console.error);
