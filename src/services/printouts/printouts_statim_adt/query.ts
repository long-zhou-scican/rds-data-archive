import { PrintoutStatimAdt, printoutsStatimAdtService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimAdt[]> {
  return printoutsStatimAdtService.query<PrintoutStatimAdt>(`
    SELECT *
    FROM printouts_statim_adt
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_adt rows: ${rows.length}`);
}

main().catch(console.error);
