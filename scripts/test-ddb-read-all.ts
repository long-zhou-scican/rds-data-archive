/**
 * Test script: Read sample data from all DynamoDB tables in a given region.
 *
 * Usage:
 *   npx tsx scripts/test-ddb-read-all.ts
 *   npx tsx scripts/test-ddb-read-all.ts us-east-1
 *
 * Ensure AWS credentials are exported before running.
 */

import { DynamoDbService } from '../datalayer/dist/index.js';

const REGION = process.argv[2] || 'us-west-2';
const MAX_ITEMS = 3;

async function main() {
  console.log('============================================');
  console.log(` DynamoDB Read Test - Region: ${REGION}`);
  console.log(` Max items per table: ${MAX_ITEMS}`);
  console.log('============================================\n');

  // List all tables
  const tableNames = await DynamoDbService.listTables(REGION);
  console.log(`Found ${tableNames.length} table(s)\n`);

  let success = 0;
  let empty = 0;
  let failed = 0;

  for (const tableName of tableNames) {
    console.log('--------------------------------------------');
    console.log(`Table: ${tableName}`);
    console.log('--------------------------------------------');

    try {
      // Describe table
      const desc = await DynamoDbService.describeTable(tableName, REGION);
      const keys = desc.keySchema
        .map((k) => `${k.attributeName} (${k.keyType})`)
        .join(', ');
      console.log(`  Keys: ${keys}`);
      console.log(`  Items: ${desc.itemCount} | Size: ${desc.sizeBytes} bytes`);

      if (desc.gsi.length > 0) {
        const gsiInfo = desc.gsi
          .map((g) => `${g.indexName} [${g.keySchema.map((k) => k.attributeName).join(', ')}]`)
          .join('; ');
        console.log(`  GSI: ${gsiInfo}`);
      }
      if (desc.lsi.length > 0) {
        const lsiInfo = desc.lsi
          .map((l) => `${l.indexName} [${l.keySchema.map((k) => k.attributeName).join(', ')}]`)
          .join('; ');
        console.log(`  LSI: ${lsiInfo}`);
      }

      // Scan sample items using DynamoDbService
      const db = new DynamoDbService(tableName, { region: REGION });
      const result = await db.scan({ limit: MAX_ITEMS });

      if (result.items.length === 0) {
        console.log('  Result: EMPTY (0 items returned)');
        empty++;
      } else {
        console.log(`  Result: OK (${result.items.length} item(s) returned)`);
        const firstItem = result.items[0] as Record<string, unknown>;
        const attributes = Object.keys(firstItem);
        console.log(`  Attributes: [${attributes.join(', ')}]`);

        // Compact preview of first item
        const preview: Record<string, string> = {};
        for (const [key, value] of Object.entries(firstItem)) {
          if (value === null || value === undefined) {
            preview[key] = 'null';
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            preview[key] = '{...}';
          } else if (Array.isArray(value)) {
            preview[key] = `[${value.length} items]`;
          } else if (typeof value === 'string' && value.length > 80) {
            preview[key] = `${value.slice(0, 80)}...`;
          } else {
            preview[key] = String(value);
          }
        }
        console.log(`  Sample: ${JSON.stringify(preview, null, 4).slice(0, 500)}`);
        success++;
      }
    } catch (err: any) {
      console.log(`  ERROR: ${err.message}`);
      failed++;
    }

    console.log('');
  }

  // Summary
  console.log('============================================');
  console.log(' Summary');
  console.log('============================================');
  console.log(`  Total tables: ${tableNames.length}`);
  console.log(`  With data:    ${success}`);
  console.log(`  Empty:        ${empty}`);
  console.log(`  Failed:       ${failed}`);
  console.log('============================================');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
