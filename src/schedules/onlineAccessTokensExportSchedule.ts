import { onlineAccessTokensService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await onlineAccessTokensService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for online_access_tokens. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
