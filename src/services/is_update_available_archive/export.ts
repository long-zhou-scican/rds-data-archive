import { isUpdateAvailableArchiveService } from "datalayer";

async function main() {
  const s3Key = await isUpdateAvailableArchiveService.export();
  console.log(`✅ is_update_available_archive exported to ${s3Key}`);
}

main().catch(console.error);
