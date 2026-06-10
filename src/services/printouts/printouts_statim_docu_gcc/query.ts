import { PrintoutStatimDocuGcc, printoutsStatimDocuGccService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimDocuGcc[]> {
  return printoutsStatimDocuGccService.query<PrintoutStatimDocuGcc>(`
    SELECT *
    FROM printouts_statim_docu_gcc
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_docu_gcc rows: ${rows.length}`);
}

main().catch(console.error);
