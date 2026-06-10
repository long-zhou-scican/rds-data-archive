import { PrintoutStatimDocuEntryNote, printoutsStatimDocuEntriesNoteService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimDocuEntryNote[]> {
  return printoutsStatimDocuEntriesNoteService.query<PrintoutStatimDocuEntryNote>(`
    SELECT *
    FROM printouts_statim_docu_entries_note
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_docu_entries_note rows: ${rows.length}`);
}

main().catch(console.error);
