import { productsSparePartsImagesService } from "datalayer";

async function main() {
  const s3Key = await productsSparePartsImagesService.export();
  console.log(`✅ products_spare_parts_images exported to ${s3Key}`);
}

main().catch(console.error);
