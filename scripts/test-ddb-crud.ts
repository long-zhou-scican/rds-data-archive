/**
 * Test script: Write, Read, and Delete a record from each DynamoDB table.
 *
 * Usage:
 *   STAGE=qa npx tsx scripts/test-ddb-crud.ts
 *   STAGE=dr npx tsx scripts/test-ddb-crud.ts
 *
 * Ensure AWS credentials are exported before running.
 */

import {
  digitalTwinSessionService,
  instrumentTrackingRfidService,
  instrumentTrackingSessionService,
  mycolteneAdminStripeEventsService,
  iotEndpointsService,
  iotScUUIDService,
  recordsDeviceEventsService,
  ceflaLambdaFunctionsUsersService,
} from '../datalayer/dist/index.js';

const TEST_PREFIX = '_TEST_CRUD_';
const timestamp = new Date().toISOString();

interface TestCase {
  name: string;
  write: () => Promise<void>;
  read: () => Promise<unknown>;
  delete: () => Promise<void>;
}

const tests: TestCase[] = [
  {
    name: 'digitalTwin-session',
    write: () => digitalTwinSessionService.put({
      pk: `${TEST_PREFIX}pk-001`,
      sk: `${TEST_PREFIX}sk-001`,
      gsi: `${TEST_PREFIX}gsi-001`,
    }),
    read: () => digitalTwinSessionService.get({
      pk: `${TEST_PREFIX}pk-001`,
      sk: `${TEST_PREFIX}sk-001`,
    }),
    delete: () => digitalTwinSessionService.delete({
      pk: `${TEST_PREFIX}pk-001`,
      sk: `${TEST_PREFIX}sk-001`,
    }),
  },
  {
    name: 'instrumentTracking-rfid',
    write: () => instrumentTrackingRfidService.put({
      pk: `${TEST_PREFIX}TAG#test-tag-001`,
      tagID: `${TEST_PREFIX}test-tag-001`,
      t_counter: 0,
      t_status: 'no_action',
    }),
    read: () => instrumentTrackingRfidService.get({
      pk: `${TEST_PREFIX}TAG#test-tag-001`,
      tagID: `${TEST_PREFIX}test-tag-001`,
    }),
    delete: () => instrumentTrackingRfidService.delete({
      pk: `${TEST_PREFIX}TAG#test-tag-001`,
      tagID: `${TEST_PREFIX}test-tag-001`,
    }),
  },
  {
    name: 'instrumentTracking-session',
    write: () => instrumentTrackingSessionService.put({
      pk: `${TEST_PREFIX}TAG#session-001#RFID-OPEN_SESSION`,
      sk: `CYCLE_START_TIME#${timestamp}`,
      gsi: `${TEST_PREFIX}DEVICE#TEST001#RFID-FAILURE`,
      tagId: 'session-001',
      sessionId: 'sess-001',
      deviceSerialNumber: 'TEST001',
      deviceModelNumber: 'Test Device',
      TimeToLive: Math.floor(Date.now() / 1000) + 86400,
    }),
    read: () => instrumentTrackingSessionService.get({
      pk: `${TEST_PREFIX}TAG#session-001#RFID-OPEN_SESSION`,
      sk: `CYCLE_START_TIME#${timestamp}`,
    }),
    delete: () => instrumentTrackingSessionService.delete({
      pk: `${TEST_PREFIX}TAG#session-001#RFID-OPEN_SESSION`,
      sk: `CYCLE_START_TIME#${timestamp}`,
    }),
  },
  {
    name: 'mycoltene-admin-stripe-events',
    write: () => mycolteneAdminStripeEventsService.put({
      PK: `${TEST_PREFIX}EVENT#evt_test_001`,
      SK: String(Math.floor(Date.now() / 1000)),
      GSI1PK: `${TEST_PREFIX}USER#cus_test#EVENT`,
      type: 'EVENT',
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: 'test-script',
      updatedBy: 'test-script',
    }),
    read: () => mycolteneAdminStripeEventsService.get({
      PK: `${TEST_PREFIX}EVENT#evt_test_001`,
    }),
    delete: () => mycolteneAdminStripeEventsService.delete({
      PK: `${TEST_PREFIX}EVENT#evt_test_001`,
    }),
  },
  {
    name: 'iot-endpoints',
    write: () => iotEndpointsService.put({
      target: `${TEST_PREFIX}target-001`,
      endpointId: `${TEST_PREFIX}endpoint-001`,
    }),
    read: () => iotEndpointsService.get({
      target: `${TEST_PREFIX}target-001`,
      endpointId: `${TEST_PREFIX}endpoint-001`,
    }),
    delete: () => iotEndpointsService.delete({
      target: `${TEST_PREFIX}target-001`,
      endpointId: `${TEST_PREFIX}endpoint-001`,
    }),
  },
  {
    name: 'iot-scUUID',
    write: () => iotScUUIDService.put({
      scUUID: `${TEST_PREFIX}TEST001-abcdef123456`,
      serialNumber: `${TEST_PREFIX}TEST001`,
      creationDate: timestamp.replace(/[T:]/g, '-').slice(0, 23),
    }),
    read: () => iotScUUIDService.get({
      scUUID: `${TEST_PREFIX}TEST001-abcdef123456`,
    }),
    delete: () => iotScUUIDService.delete({
      scUUID: `${TEST_PREFIX}TEST001-abcdef123456`,
    }),
  },
  {
    name: 'records-device-events',
    write: () => recordsDeviceEventsService.put({
      pk: `${TEST_PREFIX}DEVICE#TEST001`,
      sk: `${TEST_PREFIX}EVENT#${timestamp}`,
      gpk1: `${TEST_PREFIX}TYPE#test_event`,
      gsk1: timestamp,
      lssk1: `${TEST_PREFIX}STATUS#active`,
    }),
    read: () => recordsDeviceEventsService.get({
      pk: `${TEST_PREFIX}DEVICE#TEST001`,
      sk: `${TEST_PREFIX}EVENT#${timestamp}`,
    }),
    delete: () => recordsDeviceEventsService.delete({
      pk: `${TEST_PREFIX}DEVICE#TEST001`,
      sk: `${TEST_PREFIX}EVENT#${timestamp}`,
    }),
  },
  {
    name: 'cefla-lambda-functions-users',
    write: () => ceflaLambdaFunctionsUsersService.put({
      userId: `${TEST_PREFIX}user-001`,
    }),
    read: () => ceflaLambdaFunctionsUsersService.get({
      userId: `${TEST_PREFIX}user-001`,
    }),
    delete: () => ceflaLambdaFunctionsUsersService.delete({
      userId: `${TEST_PREFIX}user-001`,
    }),
  },
];

async function main() {
  const stage = process.env.STAGE || 'qa';
  console.log('============================================');
  console.log(` DynamoDB CRUD Test - Stage: ${stage}`);
  console.log(`  Timestamp: ${timestamp}`);
  console.log('============================================\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`--- ${test.name} ---`);

    try {
      // Write
      console.log('  [1/3] Writing...');
      await test.write();
      console.log('  [1/3] Write: OK');

      // Read
      console.log('  [2/3] Reading...');
      const item = await test.read();
      if (item) {
        console.log(`  [2/3] Read: OK -> ${JSON.stringify(item).slice(0, 200)}`);
      } else {
        throw new Error('Read returned null — item not found after write');
      }

      // Delete
      console.log('  [3/3] Deleting...');
      await test.delete();

      // Verify deletion
      const afterDelete = await test.read();
      if (afterDelete) {
        throw new Error('Delete failed — item still exists');
      }
      console.log('  [3/3] Delete: OK (verified)');
      console.log(`  PASSED\n`);
      passed++;
    } catch (err: any) {
      console.log(`  FAILED: ${err.message}\n`);
      failed++;
    }
  }

  console.log('============================================');
  console.log(' Results');
  console.log('============================================');
  console.log(`  Passed: ${passed}/${tests.length}`);
  console.log(`  Failed: ${failed}/${tests.length}`);
  console.log('============================================');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
