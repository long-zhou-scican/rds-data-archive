import { PrintoutMovedToArchive, printoutsMovedToArchivesService } from "datalayer";

export async function queryAll(limit = 100): Promise<PrintoutMovedToArchive[]> {
  return printoutsMovedToArchivesService.query<PrintoutMovedToArchive>(`
    SELECT *
    FROM printouts_moved_to_archives
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`printouts_moved_to_archives rows: ${rows.length}`);
}

main().catch(console.error);
