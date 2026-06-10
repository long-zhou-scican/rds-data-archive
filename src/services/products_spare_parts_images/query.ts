import { ProductSparePartImage, productsSparePartsImagesService } from "datalayer";

export async function queryAll(limit = 100): Promise<ProductSparePartImage[]> {
  return productsSparePartsImagesService.query<ProductSparePartImage>(`
    SELECT *
    FROM products_spare_parts_images
    LIMIT ${limit}
  `);
}

async function main() {
  const rows = await queryAll();
  console.log(`products_spare_parts_images rows: ${rows.length}`);
}

main().catch(console.error);
