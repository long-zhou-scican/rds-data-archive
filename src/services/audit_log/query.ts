import { AuditLog, auditLogService } from "datalayer";

export async function queryAll(limit = 100): Promise<AuditLog[]> {
  return auditLogService.query<AuditLog>(`
    SELECT *
    FROM audit_log
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`audit_log rows: ${rows.length}`);
}

main().catch(console.error);
