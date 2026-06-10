import { PrintoutHydrimDocuEntry, printoutsHydrimDocuEntriesService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimDocuEntry[]> {
  return printoutsHydrimDocuEntriesService.query<PrintoutHydrimDocuEntry>(`
    SELECT *
    FROM printouts_hydrim_docu_entries
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_docu_entries rows: ${rows.length}`);
}

main().catch(console.error);
