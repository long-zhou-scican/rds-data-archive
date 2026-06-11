declare function require(name: string): any;
declare const process: { cwd: () => string };
declare const __dirname: string;

const fs = require("fs");
const path = require("path");

let cachedParams: Record<string, any[]> | null = null;

function loadParams(): Record<string, any[]> {
  if (cachedParams) {
    return cachedParams;
  }

  const candidates = [
    path.resolve(process.cwd(), "src/schedules/exportScheduleParams.json"),
    path.resolve(__dirname, "exportScheduleParams.json"),
    path.resolve(__dirname, "../../src/schedules/exportScheduleParams.json"),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const normalized: Record<string, any[]> = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (Array.isArray(value)) {
        normalized[key] = value;
      }
    }

    cachedParams = normalized;
    return normalized;
  }

  cachedParams = { default: [] };
  return cachedParams;
}

export function getExportArgs(serviceKey: string): any[] {
  const params = loadParams();
  return params[serviceKey] ?? params.default ?? [];
}
