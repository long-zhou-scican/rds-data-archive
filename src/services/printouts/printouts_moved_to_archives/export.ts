import { printoutsMovedToArchivesService } from "datalayer";

async function main() {
  const s3Key = await printoutsMovedToArchivesService.export();
  console.log(`✅ printouts_moved_to_archives exported to ${s3Key}`);
}

main().catch(console.error);
