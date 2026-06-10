import { reportsUploadService } from "datalayer";

async function main() {
  const s3Key = await reportsUploadService.export();
  console.log(`✅ reportsUpload exported to ${s3Key}`);
}

main().catch(console.error);
