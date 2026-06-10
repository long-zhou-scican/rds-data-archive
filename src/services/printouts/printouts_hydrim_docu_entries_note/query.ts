import { PrintoutHydrimDocuEntryNote, printoutsHydrimDocuEntriesNoteService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimDocuEntryNote[]> {
  return printoutsHydrimDocuEntriesNoteService.query<PrintoutHydrimDocuEntryNote>(`
    SELECT *
    FROM printouts_hydrim_docu_entries_note
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_docu_entries_note rows: ${rows.length}`);
}

main().catch(console.error);
