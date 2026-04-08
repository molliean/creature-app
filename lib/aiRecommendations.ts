import Anthropic from "@anthropic-ai/sdk";
import { searchBooks, olCoverUrl, googleCoverUrl } from "@/lib/googleBooks";
import type { BookResult } from "@/components/explore/BookResultCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ClaudeBook = {
  title: string;
  author: string;
  isbn?: string;
  reason: string;
};

type ClaudeResponse = {
  books: ClaudeBook[];
};

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a brilliant, opinionated independent bookstore clerk with deep literary taste and encyclopedic knowledge of fiction, nonfiction, and poetry across all eras and cultures.

When a reader describes a mood, feeling, or type of book they want, you recommend 6–8 books that genuinely match what they're looking for — not just popular titles, but the right books for the specific vibe they've described.

You respond ONLY with valid JSON — no preamble, no explanation, no markdown fencing. The JSON must match this exact structure:

{
  "books": [
    {
      "title": "exact title of the book",
      "author": "First Last",
      "isbn": "ISBN-13, exactly 13 digits, no hyphens — REQUIRED",
      "reason": "one sentence explaining why this book perfectly matches the reader's mood"
    }
  ]
}

Rules:
- Return exactly 6–8 books
- Prioritize books that genuinely match the mood over famous names
- Include a mix of well-known and overlooked titles when appropriate
- The "reason" field must be specific to the reader's described mood — not a generic description of the book
- You MUST provide a valid 13-digit ISBN for every book. If you are uncertain of the exact ISBN, choose a different book you are confident about. Never return a book without a valid ISBN. This is a strict requirement — an incomplete response is worse than recommending a different book.
- Do not include any text outside the JSON object`;

// ---------------------------------------------------------------------------
// Raw Claude call (no tracing)
// ---------------------------------------------------------------------------

async function rawCallClaude(prompt: string): Promise<ClaudeBook[]> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const parsed: ClaudeResponse = JSON.parse(text);
  return parsed.books;
}

// ---------------------------------------------------------------------------
// Weave tracing — only initialised when WANDB_API_KEY is present
// ---------------------------------------------------------------------------

type CallFn = (prompt: string) => Promise<ClaudeBook[]>;
let callClaude: CallFn = rawCallClaude;
let weaveInitialised = false;

async function maybeInitWeave(): Promise<void> {
  if (weaveInitialised) return;
  weaveInitialised = true; // mark before awaiting to prevent concurrent inits

  const apiKey = process.env.WANDB_API_KEY;
  if (!apiKey) {
    console.info("[weave] WANDB_API_KEY not set — tracing disabled");
    return;
  }

  try {
    const weave = await import("weave");
    await weave.init("creature-app");
    callClaude = weave.op(rawCallClaude, { name: "claude-book-recommendations" });
    console.info("[weave] tracing enabled");
  } catch (err) {
    console.warn("[weave] init failed — tracing disabled:", err);
  }
}

// ---------------------------------------------------------------------------
// Google Books enrichment
// ---------------------------------------------------------------------------

async function enrichBook(book: ClaudeBook): Promise<BookResult> {
  const query = book.isbn
    ? `isbn:${book.isbn}`
    : `intitle:${encodeURIComponent(book.title)}+inauthor:${encodeURIComponent(
        book.author.split(" ").pop() ?? book.author
      )}`;

  const results = await searchBooks(query, 3);
  const googleBook = results[0] ?? null;

  const isbn = book.isbn ?? googleBook?.isbn;
  const olLarge  = isbn ? olCoverUrl(isbn, "L") : undefined;
  const olMedium = isbn ? olCoverUrl(isbn, "M") : undefined;
  const googleLast = googleBook?.id ? googleCoverUrl(googleBook.id) : undefined;

  return {
    id: googleBook?.id ?? slugify(book.title),
    title: book.title,
    author: book.author,
    year: googleBook?.year,
    publisher: googleBook?.publisher,
    pages: googleBook?.pageCount,
    genres: googleBook?.categories ?? [],
    isbn: book.isbn ?? googleBook?.isbn,
    coverUrl: olLarge ?? googleBook?.coverUrl,
    coverFallbackUrl: olMedium,
    coverLastResortUrl: googleLast,
    reason: book.reason,
  };
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getAiRecommendations(prompt: string): Promise<BookResult[]> {
  await maybeInitWeave();
  const claudeBooks = await callClaude(prompt);
  const results = await Promise.all(claudeBooks.map(enrichBook));
  return results;
}
