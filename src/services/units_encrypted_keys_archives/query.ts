import { UnitEncryptedKeyArchive, unitsEncryptedKeysArchivesService } from "datalayer";

export async function queryAll(limit = 100): Promise<UnitEncryptedKeyArchive[]> {
  return unitsEncryptedKeysArchivesService.query<UnitEncryptedKeyArchive>(`
    SELECT *
    FROM units_encrypted_keys_archives
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`units_encrypted_keys_archives rows: ${rows.length}`);
}

main().catch(console.error);
