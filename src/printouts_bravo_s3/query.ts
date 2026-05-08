import { printoutsBravoS3Service } from "duckdb_parquet_s3_library";
import { PrintoutBravoS3 } from "duckdb_parquet_s3_library";

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

async function main() {
  const data = await queryByDateRange("2021/05/06", "2021/05/16");
  console.log(data.map(d => d.printout_file_name).join(', '));

}

main().catch(console.error);