import { PrintoutStatimS3, printoutsStatimS3Service, utils } from "datalayer";

export async function queryByDateRange(
  startDate: string,
  endDate: string
): Promise<PrintoutStatimS3[]> {
  const startBounds = utils.toUtcDayBounds(startDate);
  const endBounds = utils.toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const startTs = utils.toDuckDbTimestamp(startBounds.start);
  const endExclusiveTs = utils.toDuckDbTimestamp(endBounds.end);

  return printoutsStatimS3Service.query<PrintoutStatimS3>(`
    SELECT printout_file_name
    FROM printouts_statim_s3
    WHERE date_uploaded >= TIMESTAMP '${startTs}'
      AND date_uploaded < TIMESTAMP '${endExclusiveTs}'
    ORDER BY date_uploaded ASC
  `);
}

export async function demoQueryFromMysqlAndS3(
  startDate: string,
  endDate: string,
  dateKey?: string
): Promise<{ mysql: PrintoutStatimS3[]; s3: PrintoutStatimS3[] }> {
  const startBounds = utils.toUtcDayBounds(startDate);
  const endBounds = utils.toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const split = utils.splitByFiveYearBoundary(startBounds.start, endBounds.end);

  const mysqlSql = split.withinFiveYears
    ? `
      SELECT printout_file_name
      FROM printouts_statim_s3
      WHERE date_uploaded >= '${utils.toDuckDbTimestamp(split.withinFiveYears.start)}'
        AND date_uploaded < '${utils.toDuckDbTimestamp(split.withinFiveYears.endExclusive)}'
      ORDER BY date_uploaded ASC
    `
    : `
      SELECT printout_file_name
      FROM printouts_statim_s3
      WHERE 1 = 0
    `;

  const s3Sql = split.olderThanFiveYears
    ? `
      SELECT printout_file_name
      FROM printouts_statim_s3
      WHERE date_uploaded >= TIMESTAMP '${utils.toDuckDbTimestamp(split.olderThanFiveYears.start)}'
        AND date_uploaded < TIMESTAMP '${utils.toDuckDbTimestamp(split.olderThanFiveYears.endExclusive)}'
      ORDER BY date_uploaded ASC
    `
    : `
      SELECT printout_file_name
      FROM printouts_statim_s3
      WHERE 1 = 0
    `;

  return printoutsStatimS3Service.queryFromMysqlAndS3<PrintoutStatimS3, PrintoutStatimS3>(
    mysqlSql,
    s3Sql,
    dateKey
  );
}

async function main() {
  const result = await demoQueryFromMysqlAndS3("2021/05/06", "2025/05/16");
  console.log(`mysql rows: ${result.mysql.length}`);
  console.log(`s3 rows: ${result.s3.length}`);
}

main().catch(console.error);
