import { DynamoDbService } from "../../datalayer/dist/index.js";

type ApiEvent = {
  body?: string | Record<string, unknown>;
};

interface RequestBody {
  /** DynamoDB table name (required) */
  table_name?: string;
  /** Operation type: 'get' | 'query' | 'scan' (default: 'query') */
  operation?: string;
  /** Primary key for 'get' operation */
  key?: Record<string, unknown>;
  /** GSI or LSI name for 'query' operation */
  index_name?: string;
  /** Key condition expression for 'query' (e.g. "pk = :pk AND sk BETWEEN :start AND :end") */
  key_condition?: string;
  /** Filter expression for 'query' or 'scan' */
  filter_expression?: string;
  /** Expression attribute values (e.g. { ":pk": "user#123" }) */
  expression_values?: Record<string, unknown>;
  /** Expression attribute names (e.g. { "#s": "status" }) */
  expression_names?: Record<string, string>;
  /** Projection expression to limit returned attributes */
  projection?: string;
  /** Max items per page */
  limit?: number;
  /** Sort order for query (true = ascending, false = descending) */
  scan_forward?: boolean;
  /** Pagination token from previous response */
  start_key?: Record<string, unknown>;
  /** AWS region override */
  region?: string;
}

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
    console.log("Received event:", JSON.stringify(event));
    const bodyRaw: RequestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : (event.body ?? {});

    const tableName = String(bodyRaw.table_name ?? "").trim();
    if (!tableName) {
      return json(400, { message: "Missing required field: table_name" });
    }

    const operation = String(bodyRaw.operation ?? "query").trim().toLowerCase();
    const db = new DynamoDbService(tableName, {
      region: bodyRaw.region,
    });

    switch (operation) {
      case "get": {
        if (!bodyRaw.key || Object.keys(bodyRaw.key).length === 0) {
          return json(400, { message: "Missing required field: key (for 'get' operation)" });
        }
        const item = await db.get(bodyRaw.key);
        return json(200, {
          table_name: tableName,
          operation,
          item,
        });
      }

      case "query": {
        if (!bodyRaw.key_condition) {
          return json(400, { message: "Missing required field: key_condition (for 'query' operation)" });
        }
        if (!bodyRaw.expression_values) {
          return json(400, { message: "Missing required field: expression_values (for 'query' operation)" });
        }

        const result = await db.query({
          indexName: bodyRaw.index_name,
          keyConditionExpression: bodyRaw.key_condition,
          expressionAttributeValues: bodyRaw.expression_values,
          expressionAttributeNames: bodyRaw.expression_names,
          filterExpression: bodyRaw.filter_expression,
          limit: bodyRaw.limit,
          scanIndexForward: bodyRaw.scan_forward,
          exclusiveStartKey: bodyRaw.start_key,
          projectionExpression: bodyRaw.projection,
        });

        return json(200, {
          table_name: tableName,
          operation,
          count: result.items.length,
          items: result.items,
          last_key: result.lastEvaluatedKey ?? null,
        });
      }

      case "scan": {
        const result = await db.scan({
          filterExpression: bodyRaw.filter_expression,
          expressionAttributeValues: bodyRaw.expression_values,
          expressionAttributeNames: bodyRaw.expression_names,
          limit: bodyRaw.limit,
          exclusiveStartKey: bodyRaw.start_key,
          projectionExpression: bodyRaw.projection,
        });

        return json(200, {
          table_name: tableName,
          operation,
          count: result.items.length,
          items: result.items,
          last_key: result.lastEvaluatedKey ?? null,
        });
      }

      default:
        return json(400, {
          message: `Unsupported operation: '${operation}'. Must be one of: get, query, scan`,
        });
    }
  } catch (error: any) {
    console.error("DynamoDB search error:", error);
    return json(500, {
      message: error?.message ?? "Internal Server Error",
    });
  }
};
