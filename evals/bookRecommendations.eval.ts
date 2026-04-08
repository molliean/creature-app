/**
 * Full evaluation suite for getAiRecommendations.
 *
 * Scorers:
 *   formatScorer    — structural correctness (count, fields, isbn, reason length)
 *   diversityScorer — variety (unique authors, genre spread, era spread)
 *   relevanceScorer — LLM-as-judge (Claude scores 1-5 for prompt match)
 *
 * Run: npm run eval
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local before any imports that need API keys
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
  // Rely on environment variables already set
}

import Anthropic from "@anthropic-ai/sdk";
import * as weave from "weave";
import { getAiRecommendations } from "../lib/aiRecommendations";
import type { BookResult } from "../components/explore/BookResultCard";

// ---------------------------------------------------------------------------
// Dataset — 15 diverse mood prompts
// ---------------------------------------------------------------------------

type PromptRow = {
  prompt: string;
  category: string;
};

const rows: PromptRow[] = [
  {
    prompt: "a warm, cozy read for winter — comfort food for the soul",
    category: "cozy",
  },
  {
    prompt: "something dark and deeply unsettling that will stay with me",
    category: "dark",
  },
  {
    prompt: "a fast-paced thriller I can't put down",
    category: "fast-paced",
  },
  {
    prompt: "a slow, literary novel where the prose is the point",
    category: "literary",
  },
  {
    prompt: "something short — under 200 pages — but unforgettable",
    category: "short",
  },
  {
    prompt: "translated fiction from outside the English-speaking world",
    category: "international",
  },
  {
    prompt: "a compelling non-fiction book that reads like a novel",
    category: "non-fiction",
  },
  {
    prompt: "a sweeping, deeply romantic love story",
    category: "romance",
  },
  {
    prompt: "a coming-of-age story about figuring out who you are",
    category: "coming-of-age",
  },
  {
    prompt: "something genuinely funny — I need to laugh",
    category: "comedy",
  },
  {
    prompt: "a book about grief or loss that doesn't feel sentimental",
    category: "grief",
  },
  {
    prompt: "set in Japan — I want to feel completely transported there",
    category: "place-japan",
  },
  {
    prompt: "for when you're feeling stuck, uninspired, and need a creative jolt",
    category: "inspirational",
  },
  {
    prompt: "something with the feel of classic literature but not actually assigned in school",
    category: "classics-adjacent",
  },
  {
    prompt: "something totally weird and unexpected — surreal, strange, or unlike anything else",
    category: "weird",
  },
];

// ---------------------------------------------------------------------------
// Model function
// ---------------------------------------------------------------------------

const model = weave.op(
  async function predict({ datasetRow }: { datasetRow: PromptRow }): Promise<BookResult[]> {
    return getAiRecommendations(datasetRow.prompt);
  },
  { name: "book-recommendations" }
);

// ---------------------------------------------------------------------------
// Scorer 1: formatScorer
// Checks structural correctness of each result set.
// ---------------------------------------------------------------------------

const formatScorer = weave.op(
  function formatScorer({
    modelOutput,
  }: {
    datasetRow: PromptRow;
    modelOutput: BookResult[];
  }) {
    const exactlyEight = modelOutput.length === 8;

    const perBook = modelOutput.map((book) => ({
      hasTitle: typeof book.title === "string" && book.title.length > 0,
      hasAuthor: typeof book.author === "string" && book.author.length > 0,
      hasIsbn: typeof book.isbn === "string" && book.isbn.length > 0,
      hasReason:
        typeof book.reason === "string" &&
        book.reason.trim().split(/\s+/).length >= 10,
    }));

    const validCount = perBook.filter(
      (b) => b.hasTitle && b.hasAuthor && b.hasIsbn && b.hasReason
    ).length;

    return {
      exactly_eight: exactlyEight,
      valid_count: validCount,
      all_valid: exactlyEight && validCount === modelOutput.length,
    };
  },
  { name: "format-scorer" }
);

// ---------------------------------------------------------------------------
// Scorer 2: diversityScorer
// Checks that recommendations are meaningfully varied.
// ---------------------------------------------------------------------------

// Rough genre buckets inferred from reason + title text
const GENRE_KEYWORDS: Record<string, string[]> = {
  thriller: ["thriller", "suspense", "mystery", "detective", "crime", "spy", "chase", "murder"],
  horror: ["horror", "terror", "sinister", "haunting", "dark", "disturbing", "dread", "gothic"],
  romance: ["romance", "love", "romantic", "passion", "heart", "relationship", "marriage"],
  historical: ["historical", "history", "century", "war", "empire", "ancient", "medieval"],
  scifi_fantasy: ["science fiction", "sci-fi", "fantasy", "magic", "dystopia", "utopia", "space", "future"],
  literary: ["literary", "prose", "meditative", "introspective", "contemplative", "philosophical"],
  humour: ["funny", "humor", "comic", "absurd", "satirical", "wit", "laugh"],
  nonfiction: ["essay", "memoir", "biography", "journalism", "non-fiction", "nonfiction", "true story"],
};

function inferGenres(book: BookResult): string[] {
  const text = `${book.title} ${book.reason ?? ""} ${book.genres.join(" ")}`.toLowerCase();
  return Object.entries(GENRE_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => text.includes(kw)))
    .map(([genre]) => genre);
}

const diversityScorer = weave.op(
  function diversityScorer({
    modelOutput,
  }: {
    datasetRow: PromptRow;
    modelOutput: BookResult[];
  }) {
    // Unique authors — no author should appear twice
    const authors = modelOutput.map((b) => b.author.toLowerCase().trim());
    const uniqueAuthors = new Set(authors).size === authors.length;

    // Genre variety — at least 3 distinct genre buckets represented
    const allGenres = new Set(modelOutput.flatMap(inferGenres));
    const genreVariety = allGenres.size >= 3;

    // Era spread — books should not all be from the same decade
    const years = modelOutput.map((b) => b.year).filter((y): y is number => typeof y === "number");
    let eraSpread = true;
    if (years.length >= 4) {
      const min = Math.min(...years);
      const max = Math.max(...years);
      eraSpread = max - min >= 30; // at least 30 years apart
    }

    return {
      unique_authors: uniqueAuthors,
      genre_variety: genreVariety,
      era_spread: eraSpread,
    };
  },
  { name: "diversity-scorer" }
);

// ---------------------------------------------------------------------------
// Scorer 3: relevanceScorer
// LLM-as-judge — Claude scores whether recommendations match the mood prompt.
// ---------------------------------------------------------------------------

const relevanceScorer = weave.op(
  async function relevanceScorer({
    datasetRow,
    modelOutput,
  }: {
    datasetRow: PromptRow;
    modelOutput: BookResult[];
  }) {
    const client = new Anthropic();

    const bookList = modelOutput
      .map((b, i) => `${i + 1}. "${b.title}" by ${b.author}${b.reason ? ` — ${b.reason}` : ""}`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 256,
      system:
        "You are evaluating whether book recommendations match a reader's mood request. Score 1-5 where 5 is a perfect match. Be critical.",
      messages: [
        {
          role: "user",
          content: `Mood request: "${datasetRow.prompt}"

Recommendations:
${bookList}

Respond with JSON only — no preamble, no markdown:
{"score": <integer 1-5>, "explanation": "<one sentence>"}`,
        },
      ],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const parsed = JSON.parse(text) as { score: number; explanation: string };
    return { score: parsed.score, explanation: parsed.explanation };
  },
  { name: "relevance-scorer" }
);

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.WANDB_API_KEY) {
    console.error("❌  WANDB_API_KEY is not set.");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  const client = await weave.init("creature-app");
  console.log("✓ Weave initialised\n");

  const dataset = new weave.Dataset<PromptRow>({
    name: "book-recommendation-prompts",
    rows,
  });

  const evaluation = new weave.Evaluation<PromptRow, PromptRow, BookResult[]>({
    name: "book-recommendations-eval",
    dataset,
    scorers: [formatScorer, diversityScorer, relevanceScorer],
  });

  console.log(`Running evaluation on ${rows.length} prompts…\n`);
  const results = await evaluation.evaluate({ model });

  console.log("\n── Evaluation complete ──\n");
  console.log(JSON.stringify(results, null, 2));

  await client.waitForBatchProcessing();
  console.log("\n✓ All traces flushed to Weave");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
