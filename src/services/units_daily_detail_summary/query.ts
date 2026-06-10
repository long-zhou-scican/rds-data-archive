import { UnitDailyDetailSummary, unitsDailyDetailSummaryService } from "datalayer";

export async function queryAll(limit = 100): Promise<UnitDailyDetailSummary[]> {
  return unitsDailyDetailSummaryService.query<UnitDailyDetailSummary>(`
    SELECT *
    FROM units_daily_detail_summary
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`units_daily_detail_summary rows: ${rows.length}`);
}

main().catch(console.error);
