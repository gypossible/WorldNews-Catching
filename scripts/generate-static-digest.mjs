import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getWorldMonitorFinanceDigest } from "../server/worldmonitor-finance-digest.js";

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), "..");
const publicDir = path.join(rootDir, "public");
const outputFile = path.join(publicDir, "worldmonitor-finance-digest.json");

await mkdir(publicDir, { recursive: true });

try {
  const payload = await getWorldMonitorFinanceDigest();
  await writeFile(outputFile, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Generated ${outputFile}`);
} catch (error) {
  try {
    await readFile(outputFile, "utf8");
    console.warn(
      `Digest refresh failed, keeping existing snapshot: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } catch {
    throw error;
  }
}
