import { ReportImage, reportsImagesService } from "datalayer";

export async function queryAll(limit = 100): Promise<ReportImage[]> {
  return reportsImagesService.query<ReportImage>(`
    SELECT *
    FROM reports_images
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`reports_images rows: ${rows.length}`);
}

main().catch(console.error);
