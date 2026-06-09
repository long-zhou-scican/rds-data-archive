import { printoutsBravoS3Service } from "datalayer";

async function main() {

  const s3Key = await printoutsBravoS3Service.export();
  console.log(`✅ S3 printouts_bravo exported to ${s3Key}`);

}

main().catch(console.error);