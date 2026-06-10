import { PrintoutHydrimAdt, printoutsHydrimAdtService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimAdt[]> {
  return printoutsHydrimAdtService.query<PrintoutHydrimAdt>(`
    SELECT *
    FROM printouts_hydrim_adt
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_adt rows: ${rows.length}`);
}

main().catch(console.error);
