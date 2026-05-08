import { printoutsBravoS3Service } from "duckdb_parquet_s3_library";

async function main() {

  const s3Key = await printoutsBravoS3Service.export();
  console.log(`✅ S3 printouts_bravo exported to ${s3Key}`);

}

main().catch(console.error);