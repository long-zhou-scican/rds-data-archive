import { printoutsHydrimAdtService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimAdtService.export();
  console.log(`✅ printouts_hydrim_adt exported to ${s3Key}`);
}

main().catch(console.error);
