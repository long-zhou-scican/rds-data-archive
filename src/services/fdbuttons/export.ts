import { fdbuttonsService } from "datalayer";

async function main() {
  const s3Key = await fdbuttonsService.export();
  console.log(`✅ fdbuttons exported to ${s3Key}`);
}

main().catch(console.error);
