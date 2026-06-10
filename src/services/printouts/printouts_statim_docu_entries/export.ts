import { printoutsStatimDocuEntriesService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimDocuEntriesService.export();
  console.log(`✅ printouts_statim_docu_entries exported to ${s3Key}`);
}

main().catch(console.error);
