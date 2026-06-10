import { PrintoutFaultyData, printoutsFaultyDataService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutFaultyData[]> {
  return printoutsFaultyDataService.query<PrintoutFaultyData>(`
    SELECT *
    FROM printouts_faulty_data
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_faulty_data rows: ${rows.length}`);
}

main().catch(console.error);
