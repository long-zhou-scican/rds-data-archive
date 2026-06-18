import { printoutsBiosonicS3Service } from "../../datalayer/dist/index.js";

type LambdaEvent = {
  dryRun?: boolean;
};

export const handler = async (event: LambdaEvent = {}): Promise<{ message: string; s3Keys?: string[] }> => {
  if (event.dryRun) {
    return { message: "Dry run enabled. No export executed." };
  }

  const s3Keys = await printoutsBiosonicS3Service.export();
  console.log(`S3 printouts_biosonic exported (${s3Keys.length} files)`);

  return {
    message: "Export completed",
    s3Keys,
  };
};
