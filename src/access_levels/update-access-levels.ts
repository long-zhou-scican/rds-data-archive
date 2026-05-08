
import  { accessLevelsService } from 'duckdb_parquet_s3_library';

async function main() {

  // await exportAccessLevels();
  //   const result1 = await queryAccessLevelsHybrid({
  // // localParquet: './parquet/access_levels/access_levels.parquet',
  // s3Parquet: 's3://db-parquet-exports/parquet/access_levels/access_levels.parquet',
  // sql: `     SELECT name
  //     FROM access_levels
  //   `
  // });
  
  // console.log(result1);
  await accessLevelsService.upsert( 'ADMIN');


  console.log('✅ S3 access_levels updated');

  // // get data back to verify
  // const result = await queryAccessLevelsHybrid({
  // // localParquet: './parquet/access_levels/access_levels.parquet',
  // s3Parquet: 's3://db-parquet-exports/parquet/access_levels/access_levels.parquet',
  // sql: `     SELECT name
  //     FROM access_levels
  //   `
  // });
  
  // console.log(result);
}

main().catch(console.error);