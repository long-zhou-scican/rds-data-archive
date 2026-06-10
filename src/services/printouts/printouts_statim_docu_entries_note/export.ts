import { printoutsStatimDocuEntriesNoteService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimDocuEntriesNoteService.export();
  console.log(`✅ printouts_statim_docu_entries_note exported to ${s3Key}`);
}

main().catch(console.error);
