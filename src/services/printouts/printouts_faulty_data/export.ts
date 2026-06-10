import { printoutsFaultyDataService } from "datalayer";

async function main() {
  const s3Key = await printoutsFaultyDataService.export();
  console.log(`✅ printouts_faulty_data exported to ${s3Key}`);
}

main().catch(console.error);
