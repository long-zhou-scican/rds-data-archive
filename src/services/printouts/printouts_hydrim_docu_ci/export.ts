import { printoutsHydrimDocuCiService } from "datalayer";

async function main() {
  const s3Key = await printoutsHydrimDocuCiService.export();
  console.log(`✅ printouts_hydrim_docu_ci exported to ${s3Key}`);
}

main().catch(console.error);
