import { BaseService } from "../../datalayer/dist/services/base_service.js";

declare const process: { env: Record<string, string | undefined> };

export type DateRangeSearchInput = {
  table_name: string;
  start_date: string;
  end_date: string;
  date_column?: string;
  serialNum?: string;
};

export class DynamicTableSearchService extends BaseService {
  async searchByDateRange(input: DateRangeSearchInput): Promise<{ date_column: string; serialNum?: string; rows: unknown[] }> {
    const table = this.toSafeIdentifier(input.table_name);

    const parquetPath = await this.resolveReadableParquetPath(table, input.serialNum?.trim());
    const escapedPath = parquetPath.replace(/'/g, "''");

    const duck = await this.createDuckDb();
    try {
      const columnRows = await duck.query<{ column_name: string; column_type: string }>(
        `DESCRIBE SELECT * FROM read_parquet('${escapedPath}')`
      );
    const columns = columnRows.map(r => String(r.column_name));

    const candidateDateColumns = [
      "date",
      "createdon",
      "request_date",
      "created_date",
      "updated_date",
      "updaloaded",
      "creation_date_time",
      "created_at",
      "date_originated",
      "date_of_summary",
      "timestamp",
      "date_time",
      "factory_offsets_update_date",
    ];

    const requestedDateColumn = input.date_column?.trim();
    let dateColumn: string | undefined;

    if (requestedDateColumn) {
      const safeRequestedDateColumn = this.toSafeIdentifier(requestedDateColumn);
      if (!columns.includes(safeRequestedDateColumn)) {
        throw new Error(
          `Requested date_column '${safeRequestedDateColumn}' was not found on S3 parquet for table ${table}`
        );
      }
      dateColumn = safeRequestedDateColumn;
    } else {
      dateColumn = candidateDateColumns.find(c => columns.includes(c));
    }

    if (!dateColumn) {
      throw new Error(`No supported date column found on S3 parquet for table ${table}`);
    }

    const startLiteral = this.toSqlStringLiteral(input.start_date);
    const endLiteral = this.toSqlStringLiteral(input.end_date);
    const isDateOnlyEnd = this.isDateOnly(input.end_date);
    const selectedColumnType = columnRows.find(r => r.column_name === dateColumn)?.column_type ?? "";
    const isUnixTimestampColumn = this.isUnixTimestampColumnType(selectedColumnType, dateColumn);
    const quotedDateColumn = this.toDuckDbIdentifier(dateColumn);

    const whereClause = isUnixTimestampColumn
      ? this.buildUnixTimestampWhereClause(quotedDateColumn, startLiteral, endLiteral, isDateOnlyEnd)
      : this.buildStandardDateWhereClause(quotedDateColumn, startLiteral, endLiteral, isDateOnlyEnd);

    const requestedSerialNum = input.serialNum?.trim();
    const serialFilterClause = this.buildSerialFilterClause(requestedSerialNum, columns);
    const combinedWhereClause = serialFilterClause
      ? `(${whereClause}) AND (${serialFilterClause})`
      : whereClause;

    const sql = [
      `SELECT * FROM read_parquet('${escapedPath}')`,
      `WHERE ${combinedWhereClause}`,
      `ORDER BY ${quotedDateColumn} ASC`,
      `LIMIT 1000`,
    ].join("\n      ");
      console.log(`Executing SQL on DuckDB:\n${sql}`);
      const rows = await duck.query<unknown>(sql);
      return {
        date_column: dateColumn,
        ...(requestedSerialNum ? { serialNum: requestedSerialNum } : {}),
        rows,
      };
    } finally {
      await duck.close();
    }
  }

  private async resolveReadableParquetPath(table: string, serialNum?: string): Promise<string> {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error("Missing S3_BUCKET environment variable");
    }
    console.log(`Resolving parquet path for table ${table} in bucket ${bucket}${serialNum ? ` (serial: ${serialNum})` : ''}`);

    const preferredPrefix = "database";

    // If a serial number is provided, try the direct serial-partitioned path first.
    // This avoids globbing thousands of partition files.
    if (serialNum) {
      const safeSerial = serialNum.replace(/[^A-Za-z0-9._-]/g, '_');
      const directCandidates = [
        `s3://${bucket}/${preferredPrefix}/${table}/${safeSerial}/${table}-${safeSerial}.parquet`,
        `s3://${bucket}/${preferredPrefix}/${table}/${safeSerial}/*.parquet`,
      ];

      const duck = await this.createDuckDb();
      try {
        for (const path of directCandidates) {
          const escapedPath = path.replace(/'/g, "''");
          try {
            await duck.query(`SELECT 1 FROM read_parquet('${escapedPath}') LIMIT 1`);
            console.log(`Resolved direct serial path: ${path}`);
            return path;
          } catch {
            // Try next candidate
          }
        }
      } finally {
        await duck.close();
      }
      console.log(`Direct serial path not found for ${safeSerial}, falling back to glob`);
    }

    // Fallback: glob all parquet files for the table
    const candidates = [
      `s3://${bucket}/${preferredPrefix}/${table}/**/*.parquet`,
    ];
    console.log(`Resolving parquet path for table ${table}. Candidate paths: ${candidates.join(", ")}`);
    const duck = await this.createDuckDb();
    try {
      for (const path of candidates) {
        const escapedPath = path.replace(/'/g, "''");
        try {
          await duck.query(`SELECT 1 FROM read_parquet('${escapedPath}') LIMIT 1`);
          return path;
        } catch {
          // Try next candidate path.
        }
      }
    } finally {
      await duck.close();
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

  private buildStandardDateWhereClause(
    quotedDateColumn: string,
    startLiteral: string,
    endLiteral: string,
    isDateOnlyEnd: boolean
  ): string {
    if (isDateOnlyEnd) {
      return `${quotedDateColumn} >= ${startLiteral} AND ${quotedDateColumn} < (CAST(${endLiteral} AS DATE) + INTERVAL 1 DAY)`;
    }
    return `${quotedDateColumn} >= ${startLiteral} AND ${quotedDateColumn} <= ${endLiteral}`;
  }

  private buildUnixTimestampWhereClause(
    quotedDateColumn: string,
    startLiteral: string,
    endLiteral: string,
    isDateOnlyEnd: boolean
  ): string {
    const normalizedEpochExpression = `(CASE WHEN ABS(${quotedDateColumn}) >= 100000000000 THEN ${quotedDateColumn} / 1000.0 ELSE ${quotedDateColumn} END)`;
    const startEpochExpression = `epoch(CAST(${startLiteral} AS TIMESTAMP))`;
    const endEpochExpression = isDateOnlyEnd
      ? `epoch(CAST(${endLiteral} AS DATE) + INTERVAL 1 DAY)`
      : `epoch(CAST(${endLiteral} AS TIMESTAMP))`;

    if (isDateOnlyEnd) {
      return `${normalizedEpochExpression} >= ${startEpochExpression} AND ${normalizedEpochExpression} < ${endEpochExpression}`;
    }

    return `${normalizedEpochExpression} >= ${startEpochExpression} AND ${normalizedEpochExpression} <= ${endEpochExpression}`;
  }

  private isUnixTimestampColumnType(columnType: string, columnName: string): boolean {
    const normalizedType = String(columnType || "").toUpperCase();
    const normalizedName = String(columnName || "").toLowerCase();

    const isNumericType = ["TINYINT", "SMALLINT", "INTEGER", "BIGINT", "HUGEINT", "UTINYINT", "USMALLINT", "UINTEGER", "UBIGINT", "DOUBLE", "FLOAT", "DECIMAL", "NUMERIC", "REAL"].some(type => normalizedType.includes(type));

    if (!isNumericType) return false;

    return normalizedName.includes("timestamp") || normalizedName.includes("epoch") || normalizedName.endsWith("_ts") || normalizedName.endsWith("ts") || normalizedName.includes("time");
  }

  private isDateOnly(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private toDuckDbIdentifier(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  private buildSerialFilterClause(serialNum: string | undefined, columns: string[]): string | undefined {
    if (!serialNum) {
      return undefined;
    }

    if (!columns.includes("serial_num")) {
      throw new Error("serialNum was provided but 'serial_num' column was not found on S3 parquet");
    }

    const quotedSerialColumn = this.toDuckDbIdentifier("serial_num");
    const serialLiteral = this.toSqlStringLiteral(serialNum);
    return `TRIM(${quotedSerialColumn}) = ${serialLiteral}`;
  }
}

export const dynamicTableSearchService = new DynamicTableSearchService();
