import { unitsEncryptedKeysArchivesService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await unitsEncryptedKeysArchivesService.export(...getExportArgs("unitsEncryptedKeysArchivesService"));
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_encrypted_keys_archives. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
