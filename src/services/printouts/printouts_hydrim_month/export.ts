import { printoutsHydrimMonthService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimMonthService.export();
  console.log(`✅ printouts_hydrim_month exported to ${s3Key}`);
}

main().catch(console.error);
