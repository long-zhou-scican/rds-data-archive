import { UnitDailyGeneralCountSummary, unitsDailyGeneralCountSummaryService } from "datalayer";

export async function queryAll(limit = 100): Promise<UnitDailyGeneralCountSummary[]> {
  return unitsDailyGeneralCountSummaryService.query<UnitDailyGeneralCountSummary>(`
    SELECT *
    FROM units_daily_general_count_summary
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`units_daily_general_count_summary rows: ${rows.length}`);
}

main().catch(console.error);
