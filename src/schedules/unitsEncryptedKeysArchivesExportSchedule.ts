import { unitsEncryptedKeysArchivesService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsEncryptedKeysArchivesService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_encrypted_keys_archives. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
