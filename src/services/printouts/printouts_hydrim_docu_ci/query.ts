import { PrintoutHydrimDocuCi, printoutsHydrimDocuCiService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutHydrimDocuCi[]> {
  return printoutsHydrimDocuCiService.query<PrintoutHydrimDocuCi>(`
    SELECT *
    FROM printouts_hydrim_docu_ci
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_hydrim_docu_ci rows: ${rows.length}`);
}

main().catch(console.error);
