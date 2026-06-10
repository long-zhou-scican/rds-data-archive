import { printoutsStatimDocuGccService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimDocuGccService.export();
  console.log(`✅ printouts_statim_docu_gcc exported to ${s3Key}`);
}

main().catch(console.error);
