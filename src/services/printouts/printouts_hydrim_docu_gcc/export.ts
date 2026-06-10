import { printoutsHydrimDocuGccService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimDocuGccService.export();
  console.log(`✅ printouts_hydrim_docu_gcc exported to ${s3Key}`);
}

main().catch(console.error);
