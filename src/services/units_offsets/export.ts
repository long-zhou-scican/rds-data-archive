import { unitsOffsetsService } from "datalayer";

async function main() {
  const s3Key = await unitsOffsetsService.export();
  console.log(`✅ units_offsets exported to ${s3Key}`);
}

main().catch(console.error);
