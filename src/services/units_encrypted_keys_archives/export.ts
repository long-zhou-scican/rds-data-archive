import { unitsEncryptedKeysArchivesService } from "datalayer";

async function main() {
  const s3Key = await unitsEncryptedKeysArchivesService.export();
  console.log(`✅ units_encrypted_keys_archives exported to ${s3Key}`);
}

main().catch(console.error);
