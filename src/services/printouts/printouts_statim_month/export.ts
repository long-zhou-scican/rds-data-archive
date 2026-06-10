import { printoutsStatimMonthService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimMonthService.export();
  console.log(`✅ printouts_statim_month exported to ${s3Key}`);
}

main().catch(console.error);
