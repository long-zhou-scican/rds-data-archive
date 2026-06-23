import { onlineAccessTokensService } from "../../datalayer/dist/index.js";
import { getExportArgs } from "./exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("onlineAccessTokensService");
  if (exportArgs.length > 0) {
    console.warn("onlineAccessTokensService ignores configured export args; using default export()");
  }
  console.log(`Starting scheduled export for online_access_tokens with args: ${JSON.stringify(exportArgs)}`);
  const result = await onlineAccessTokensService.exportBySerialNumber(exportArgs[0], true, 'serial_number');
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for online_access_tokens. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
