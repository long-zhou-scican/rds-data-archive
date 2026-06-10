import { printoutsBravoS3Service, utils } from "datalayer";
import { PrintoutBravoS3 } from "datalayer";







export async function queryByDateRange(
  startDate: string,
  endDate: string
): Promise<PrintoutBravoS3[]> {
  const startBounds = utils.toUtcDayBounds(startDate);
  const endBounds = utils.toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const startTs = utils.toDuckDbTimestamp(startBounds.start);
  const endExclusiveTs = utils.toDuckDbTimestamp(endBounds.end);

  return printoutsBravoS3Service.query<PrintoutBravoS3>(`
    SELECT printout_file_name
    FROM printouts_bravo_s3
    WHERE date_uploaded >= TIMESTAMP '${startTs}'
      AND date_uploaded < TIMESTAMP '${endExclusiveTs}'
    ORDER BY date_uploaded ASC
  `);
}

/**
 * Demo helper that queries the same date range from both MySQL and S3/DuckDB.
 * Optionally pass dateKey (YYYY/MM/DD) to target a single parquet partition.
 */
export async function demoQueryFromMysqlAndS3(
  startDate: string,
  endDate: string,
  dateKey?: string
): Promise<{ mysql: PrintoutBravoS3[]; s3: PrintoutBravoS3[] }> {
  const startBounds = utils.toUtcDayBounds(startDate);
  const endBounds = utils.toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const split = utils.splitByFiveYearBoundary(startBounds.start, endBounds.end);
  console.log('Date range split:', {
    startDate,
    endDate,
    olderThanFiveYears: split.olderThanFiveYears
      ? {
          start: split.olderThanFiveYears.start.toISOString(),
          endExclusive: split.olderThanFiveYears.endExclusive.toISOString(),
        }
      : null,
    withinFiveYears: split.withinFiveYears
      ? {
          start: split.withinFiveYears.start.toISOString(),
          endExclusive: split.withinFiveYears.endExclusive.toISOString(),
        }
      : null,
  });

  // MySQL gets records within the last 5 years.
  const mysqlSql = split.withinFiveYears
    ? `
      SELECT printout_file_name
      FROM printouts_bravo_s3
      WHERE date_uploaded >= '${utils.toDuckDbTimestamp(split.withinFiveYears.start)}'
        AND date_uploaded < '${utils.toDuckDbTimestamp(split.withinFiveYears.endExclusive)}'
      ORDER BY date_uploaded ASC
    `
    : `
      SELECT printout_file_name
      FROM printouts_bravo_s3
      WHERE 1 = 0
    `;

  // S3/DuckDB gets records older than 5 years.
  const s3Sql = split.olderThanFiveYears
    ? `
      SELECT printout_file_name
      FROM printouts_bravo_s3
      WHERE date_uploaded >= TIMESTAMP '${utils.toDuckDbTimestamp(split.olderThanFiveYears.start)}'
        AND date_uploaded < TIMESTAMP '${utils.toDuckDbTimestamp(split.olderThanFiveYears.endExclusive)}'
      ORDER BY date_uploaded ASC
    `
    : `
      SELECT printout_file_name
      FROM printouts_bravo_s3
      WHERE 1 = 0
    `;

  return printoutsBravoS3Service.queryFromMysqlAndS3<PrintoutBravoS3, PrintoutBravoS3>(
    mysqlSql,
    s3Sql,
    dateKey
  );
}

async function main() {
  console.log('Querying printouts_bravo_s3 from MySQL and S3/DuckDB for date range 2017/05/06 - 2025/05/16...', Date.now());
  const result = await demoQueryFromMysqlAndS3("2017/05/06", "2025/05/16");
  console.log(`mysql rows: ${result.mysql.length}`, Date.now());
  console.log(`s3 rows: ${result.s3.length}`, Date.now());
  console.log('sample mysql printout_file_name:', result.mysql.slice(0, 5).map(d => d.printout_file_name).join(', '));
  console.log('sample s3 printout_file_name:', result.s3.slice(0, 5).map(d => d.printout_file_name).join(', '));

}

main().catch(console.error);