import { IsUpdateAvailableArchive, isUpdateAvailableArchiveService } from "datalayer";

export async function queryAll(limit = 100): Promise<IsUpdateAvailableArchive[]> {
  return isUpdateAvailableArchiveService.query<IsUpdateAvailableArchive>(`
    SELECT *
    FROM is_update_available_archive
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`is_update_available_archive rows: ${rows.length}`);
}

main().catch(console.error);
