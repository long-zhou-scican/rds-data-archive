import {
  dynamicTableSearchService,
  type DateRangeSearchInput,
} from "../services/dynamicTableSearchService.js";

type ApiEvent = {
  body?: string | { table_name?: unknown; start_date?: unknown; end_date?: unknown };
};

const json = (statusCode: number, payload: unknown) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload, (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  }),
});

export const handler = async (event: ApiEvent) => {
  try {
    const bodyRaw = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const table_name = String(bodyRaw?.table_name ?? "").trim();
    const start_date = String(bodyRaw?.start_date ?? "").trim();
    const end_date = String(bodyRaw?.end_date ?? "").trim();

    if (!table_name || !start_date || !end_date) {
      return json(400, {
        message: "Invalid request body. Required: table_name, start_date, end_date",
      });
    }

    const payload: DateRangeSearchInput = { table_name, start_date, end_date };
    const result = await dynamicTableSearchService.searchByDateRange(payload);
    return json(200, {
      table_name,
      date_column: result.date_column,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    return json(500, {
      message: error?.message ?? "Internal Server Error",
    });
  }
};
