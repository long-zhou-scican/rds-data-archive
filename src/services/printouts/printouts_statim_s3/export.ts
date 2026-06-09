import { printoutsStatimS3Service } from "datalayer";

async function main() {
  const s3Keys = await printoutsStatimS3Service.export();
  console.log(`✅ S3 printouts_statim exported (${s3Keys.length} files)`);
}

main().catch(console.error);
