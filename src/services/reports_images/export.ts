import { reportsImagesService } from "datalayer";

async function main() {
  const s3Key = await reportsImagesService.export();
  console.log(`✅ reports_images exported to ${s3Key}`);
}

main().catch(console.error);
