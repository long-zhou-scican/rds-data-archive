import { OnlineAccessToken, onlineAccessTokensService } from "datalayer";

export async function queryAll(limit = 100): Promise<OnlineAccessToken[]> {
  return onlineAccessTokensService.query<OnlineAccessToken>(`
    SELECT *
    FROM online_access_tokens
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`online_access_tokens rows: ${rows.length}`);
}

main().catch(console.error);
