import { auditLogService } from "datalayer";

async function main() {
  const s3Key = await auditLogService.export();
  console.log(`✅ audit_log exported to ${s3Key}`);
}

main().catch(console.error);
