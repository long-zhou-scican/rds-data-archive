import { printoutsEmailMd5sumLockService } from "datalayer";

async function main() {
  const s3Key = await printoutsEmailMd5sumLockService.export();
  console.log(`✅ printouts_email_md5sum_lock exported to ${s3Key}`);
}

main().catch(console.error);
