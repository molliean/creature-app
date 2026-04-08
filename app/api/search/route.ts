import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/googleBooks";
import type { BookResult } from "@/components/explore/BookResultCard";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ books: [] });

  const googleBooks = await searchBooks(q);

  const books: BookResult[] = googleBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.authors.join(", "),
    year: b.year,
    publisher: b.publisher,
    pages: b.pageCount,
    genres: b.categories ?? [],
    coverUrl: b.coverUrl,
    coverFallbackUrl: b.coverFallbackUrl,
    coverLastResortUrl: b.coverLastResortUrl,
  }));

  return NextResponse.json({ books });
}
