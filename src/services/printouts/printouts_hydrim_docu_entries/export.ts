import { printoutsHydrimDocuEntriesService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimDocuEntriesService.export();
  console.log(`✅ printouts_hydrim_docu_entries exported to ${s3Key}`);
}

main().catch(console.error);
