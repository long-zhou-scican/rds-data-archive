import { PrintoutStatimDocuEntry, printoutsStatimDocuEntriesService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimDocuEntry[]> {
  return printoutsStatimDocuEntriesService.query<PrintoutStatimDocuEntry>(`
    SELECT *
    FROM printouts_statim_docu_entries
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_docu_entries rows: ${rows.length}`);
}

main().catch(console.error);
