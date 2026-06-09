import { printoutsHydrimS3Service } from "datalayer";

async function main() {
  const s3Keys = await printoutsHydrimS3Service.export();
  console.log(`✅ S3 printouts_hydrim exported (${s3Keys.length} files)`);
}

main().catch(console.error);
