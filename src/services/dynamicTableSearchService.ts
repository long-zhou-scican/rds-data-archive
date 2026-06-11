import { BaseService } from "../../datalayer/dist/services/base_service.js";

declare const process: { env: Record<string, string | undefined> };

export type DateRangeSearchInput = {
  table_name: string;
  start_date: string;
  end_date: string;
};

export class DynamicTableSearchService extends BaseService {
  async searchByDateRange(input: DateRangeSearchInput): Promise<{ date_column: string; rows: unknown[] }> {
    const table = this.toSafeIdentifier(input.table_name);

    const parquetPath = await this.resolveReadableParquetPath(table);
    const escapedPath = parquetPath.replace(/'/g, "''");

    const duck = await this.createDuckDb();
    const columnRows = await duck.query<{ column_name: string }>(
      `DESCRIBE SELECT * FROM read_parquet('${escapedPath}')`
    );
    const columns = columnRows.map(r => String(r.column_name));

    const candidateDateColumns = [
      "date",
      "created_at",
      "updated_at",
      "date_originated",
      "timestamp",
      "date_time",
    ];

    const dateColumn = candidateDateColumns.find(c => columns.includes(c));
    if (!dateColumn) {
      throw new Error(`No supported date column found on S3 parquet for table ${table}`);
    }

    const startLiteral = this.toSqlStringLiteral(input.start_date);
    const endLiteral = this.toSqlStringLiteral(input.end_date);
    const quotedDateColumn = this.toDuckDbIdentifier(dateColumn);
    const sql = [
      `SELECT * FROM read_parquet('${escapedPath}')`,
      `WHERE ${quotedDateColumn} >= ${startLiteral} AND ${quotedDateColumn} <= ${endLiteral}`,
      `ORDER BY ${quotedDateColumn} ASC`,
      `LIMIT 1000`,
    ].join("\n      ");

    const rows = await duck.query<unknown>(sql);
    return { date_column: dateColumn, rows };
  }

  private async resolveReadableParquetPath(table: string): Promise<string> {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error("Missing S3_BUCKET environment variable");
    }

    const preferredPrefix = table.startsWith("printouts") ? "printouts" : "parquet";
    const fallbackPrefix = preferredPrefix === "parquet" ? "printouts" : "parquet";
    const candidates = [
      `s3://${bucket}/${preferredPrefix}/${table}/**/*.parquet`,
      `s3://${bucket}/${fallbackPrefix}/${table}/**/*.parquet`,
    ];

    const duck = await this.createDuckDb();
    for (const path of candidates) {
      const escapedPath = path.replace(/'/g, "''");
      try {
        await duck.query(`SELECT 1 FROM read_parquet('${escapedPath}') LIMIT 1`);
        return path;
      } catch {
        // Try next candidate path.
      }
    }

    throw new Error(`No parquet files found in S3 for table ${table}`);
  }

  private toSafeIdentifier(identifier: string): string {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid table name: ${identifier}`);
    }
    return identifier;
  }

  private toSqlStringLiteral(value: string): string {
    return `'${value.replace(/'/g, "''")}'`;
  }

  private toDuckDbIdentifier(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }
}

export const dynamicTableSearchService = new DynamicTableSearchService();
