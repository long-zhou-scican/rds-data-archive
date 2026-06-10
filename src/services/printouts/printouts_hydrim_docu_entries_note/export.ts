import { printoutsHydrimDocuEntriesNoteService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimDocuEntriesNoteService.export();
  console.log(`✅ printouts_hydrim_docu_entries_note exported to ${s3Key}`);
}

main().catch(console.error);
