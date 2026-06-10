import { CycleReportLog, cycleReportsLogService } from "datalayer";

export async function queryAll(limit = 100): Promise<CycleReportLog[]> {
  return cycleReportsLogService.query<CycleReportLog>(`
    SELECT *
    FROM cycle_reports_log
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`cycle_reports_log rows: ${rows.length}`);
}

main().catch(console.error);
