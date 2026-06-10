import { UnitOffset, unitsOffsetsService } from "datalayer";

export async function queryAll(limit = 100): Promise<UnitOffset[]> {
  return unitsOffsetsService.query<UnitOffset>(`
    SELECT *
    FROM units_offsets
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`units_offsets rows: ${rows.length}`);
}

main().catch(console.error);
