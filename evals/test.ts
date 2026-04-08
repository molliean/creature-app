/**
 * Minimal Weave eval for getAiRecommendations.
 *
 * What gets traced:
 *   run-eval (weave.op — this file)
 *   └─ claude-book-recommendations (weave.op — aiRecommendations.ts)
 *      └─ create (auto-instrumented by weave's Anthropic integration)
 *
 * Run: npm run eval:test
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Load .env.local before anything else so WANDB_API_KEY and ANTHROPIC_API_KEY
// are available to all imports.
// ---------------------------------------------------------------------------
try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // No .env.local — rely on environment variables already set
}

import * as weave from "weave";
import { getAiRecommendations } from "../lib/aiRecommendations";

const TEST_PROMPT = "a slow, melancholy literary novel set somewhere cold";

// ---------------------------------------------------------------------------
// Wrap the public function so this eval shows up as its own named span in Weave
// ---------------------------------------------------------------------------
const runEval = weave.op(
  async (prompt: string) => {
    console.log(`\nPrompt: "${prompt}"\n`);
    const results = await getAiRecommendations(prompt);
    return results;
  },
  { name: "run-eval" }
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!process.env.WANDB_API_KEY) {
    console.error("❌  WANDB_API_KEY is not set. Add it to .env.local.");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY is not set. Add it to .env.local.");
    process.exit(1);
  }

  const client = await weave.init("creature-app");
  console.log("✓ Weave initialised (project: creature-app)");

  const results = await runEval(TEST_PROMPT);

  console.log(`\n${results.length} recommendations:\n`);
  for (const book of results) {
    const year = book.year ? ` (${book.year})` : "";
    console.log(`  • ${book.title} — ${book.author}${year}`);
    if (book.reason) console.log(`    ${book.reason}`);
  }

  // Flush any pending trace batches before the process exits
  await client.waitForBatchProcessing();
  console.log("\n✓ Traces flushed to Weave");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
