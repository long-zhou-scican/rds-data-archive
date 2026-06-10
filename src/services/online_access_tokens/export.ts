import { onlineAccessTokensService } from "datalayer";

async function main() {
  const s3Key = await onlineAccessTokensService.export();
  console.log(`✅ online_access_tokens exported to ${s3Key}`);
}

main().catch(console.error);
