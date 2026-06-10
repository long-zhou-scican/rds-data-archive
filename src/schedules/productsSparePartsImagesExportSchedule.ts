import { productsSparePartsImagesService } from "../../datalayer/dist/index.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const result = await productsSparePartsImagesService.export();
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for products_spare_parts_images. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
