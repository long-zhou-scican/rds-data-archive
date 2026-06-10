import { Fdbutton, fdbuttonsService } from "datalayer";

export async function queryAll(limit = 100): Promise<Fdbutton[]> {
  return fdbuttonsService.query<Fdbutton>(`
    SELECT *
    FROM fdbuttons
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`fdbuttons rows: ${rows.length}`);
}

main().catch(console.error);
