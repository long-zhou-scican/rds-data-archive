import { PrintoutHydrimMonth, printoutsHydrimMonthService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimMonth[]> {
  return printoutsHydrimMonthService.query<PrintoutHydrimMonth>(`
    SELECT *
    FROM printouts_hydrim_month
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_month rows: ${rows.length}`);
}

main().catch(console.error);
