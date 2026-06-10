import { printoutsStatimAdtService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimAdtService.export();
  console.log(`✅ printouts_statim_adt exported to ${s3Key}`);
}

main().catch(console.error);
