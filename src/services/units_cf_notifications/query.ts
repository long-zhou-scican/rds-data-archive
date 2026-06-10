import { UnitCfNotification, unitsCfNotificationsService } from "datalayer";

export async function queryAll(limit = 100): Promise<UnitCfNotification[]> {
  return unitsCfNotificationsService.query<UnitCfNotification>(`
    SELECT *
    FROM units_cf_notifications
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`units_cf_notifications rows: ${rows.length}`);
}

main().catch(console.error);
