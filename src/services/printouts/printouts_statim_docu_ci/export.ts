import { printoutsStatimDocuCiService } from "datalayer";

async function main() {
  const s3Key = await printoutsStatimDocuCiService.export();
  console.log(`✅ printouts_statim_docu_ci exported to ${s3Key}`);
}

main().catch(console.error);
