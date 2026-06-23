import { unitsEncryptedKeysArchivesService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("unitsEncryptedKeysArchivesService");
  if (exportArgs.length > 0) {
    console.warn("unitsEncryptedKeysArchivesService ignores configured export args; using default export()");
  }
  console.log(`Starting scheduled export for units_encrypted_keys_archives with args: ${JSON.stringify(exportArgs)}`);
  const result = await unitsEncryptedKeysArchivesService.exportBySerialNumber(exportArgs[0], true, );
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for units_encrypted_keys_archives. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
