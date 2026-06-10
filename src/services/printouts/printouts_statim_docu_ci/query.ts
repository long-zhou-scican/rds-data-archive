import { PrintoutStatimDocuCi, printoutsStatimDocuCiService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutStatimDocuCi[]> {
  return printoutsStatimDocuCiService.query<PrintoutStatimDocuCi>(`
    SELECT *
    FROM printouts_statim_docu_ci
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_statim_docu_ci rows: ${rows.length}`);
}

main().catch(console.error);
