import { printoutsStatimMonthService } from "../../../datalayer/dist/index.js";
import { getExportArgs } from "../exportScheduleParams.js";

export const handler = async (): Promise<{ message: string; keys: string[] }> => {
  const exportArgs = getExportArgs("printoutsStatimMonthService");
  if (!exportArgs) {
    console.log("No export arguments found for printoutsStatimMonthService. Skipping export.");
    return {
      message: "No export arguments found. Skipping export.",
      keys: [],
    };
  }
  const result = await printoutsStatimMonthService.exportBySerialNumber(exportArgs[0], true);
  const keys = Array.isArray(result) ? result : [result];
  console.log(`Scheduled export completed for printouts/printouts_statim_month. Files: ${keys.length}`);

  return {
    message: "Scheduled export completed",
    keys,
  };
};
