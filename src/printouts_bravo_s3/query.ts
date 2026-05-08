import { printoutsBravoS3Service } from "datalayer";
import { PrintoutBravoS3 } from "datalayer";

function toUtcDayBounds(dateInput: string): { start: Date; end: Date } {
  const normalized = dateInput.replace(/\//g, "-");
  const d = new Date(`${normalized}T00:00:00.000Z`);

  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${dateInput}. Use YYYY-MM-DD or YYYY/MM/DD.`);
  }

  const start = d;
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

function toDuckDbTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function queryByDateRange(
  startDate: string,
  endDate: string
): Promise<PrintoutBravoS3[]> {
  const startBounds = toUtcDayBounds(startDate);
  const endBounds = toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const startTs = toDuckDbTimestamp(startBounds.start);
  const endExclusiveTs = toDuckDbTimestamp(endBounds.end);

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
  const startBounds = toUtcDayBounds(startDate);
  const endBounds = toUtcDayBounds(endDate);

  if (startBounds.start.getTime() > endBounds.start.getTime()) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const startTs = toDuckDbTimestamp(startBounds.start);
  const endExclusiveTs = toDuckDbTimestamp(endBounds.end);

  const mysqlSql = `
    SELECT *
    FROM printouts_bravo_s3
    WHERE date_uploaded >= '${startTs}'
      AND date_uploaded < '${endExclusiveTs}'
    ORDER BY date_uploaded ASC
  `;

  const s3Sql = `
    SELECT *
    FROM printouts_bravo_s3
    WHERE date_uploaded >= TIMESTAMP '${startTs}'
      AND date_uploaded < TIMESTAMP '${endExclusiveTs}'
    ORDER BY date_uploaded ASC
  `;

  return printoutsBravoS3Service.queryFromMysqlAndS3<PrintoutBravoS3, PrintoutBravoS3>(
    mysqlSql,
    s3Sql,
    dateKey
  );
}

async function main() {
  const result = await demoQueryFromMysqlAndS3("2021/05/06", "2021/05/16");
  console.log(`mysql rows: ${result.mysql.length}`);
  console.log(`s3 rows: ${result.s3.length}`);
  console.log('sample mysql printout_file_name:', result.mysql.slice(0, 5).map(d => d.printout_file_name).join(', '));
  console.log('sample s3 printout_file_name:', result.s3.slice(0, 5).map(d => d.printout_file_name).join(', '));

}

main().catch(console.error);