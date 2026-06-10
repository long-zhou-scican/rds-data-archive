import { PrintoutHydrimDocuGcc, printoutsHydrimDocuGccService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimDocuGcc[]> {
  return printoutsHydrimDocuGccService.query<PrintoutHydrimDocuGcc>(`
    SELECT *
    FROM printouts_hydrim_docu_gcc
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_docu_gcc rows: ${rows.length}`);
}

main().catch(console.error);
