import { PrintoutStatimMonth, printoutsStatimMonthService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimMonth[]> {
  return printoutsStatimMonthService.query<PrintoutStatimMonth>(`
    SELECT *
    FROM printouts_statim_month
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_month rows: ${rows.length}`);
}

main().catch(console.error);
