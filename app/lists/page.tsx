import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { BookCarousel } from "@/components/home/BookCarousel";
import { LISTS } from "@/lib/lists";
import { getBookByTitleAndAuthor } from "@/lib/googleBooks";

export const metadata: Metadata = {
  title: "Curated Lists — Creature",
};

// Revalidate the page once every 24 hours so cover images stay fresh
// without re-fetching on every request.
export const revalidate = 86400;

export default async function ListsPage() {
  // Resolve cover images for all books across all lists in parallel
  const resolvedLists = await Promise.all(
    LISTS.map(async (list) => {
      const books = await Promise.all(
        list.books.map(async ({ title, author }) => {
          const book = await getBookByTitleAndAuthor(title, author);
          if (!book) return null;
          return {
            slug: book.id,
            title,
            author,
            coverTone: "bg-[#8B9DAA]" as const,
            coverUrl: book.coverUrl,
            coverFallbackUrl: book.coverFallbackUrl,
            coverLastResortUrl: book.coverLastResortUrl,
          };
        })
      );
      return {
        id: list.id,
        heading: list.heading,
        books: books.filter((b): b is NonNullable<typeof b> => b !== null),
      };
    })
  );

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-[#1A1A1A]">
      <TopNav />
      <main className="flex flex-col gap-8 px-4 pt-8 pb-16 md:gap-12 md:px-6 md:pt-10">
        {/* Page heading */}
        <div className="flex flex-col gap-2 px-[10px]">
          <h1 className="type-h1 text-[#1A1A1A]">Curated lists</h1>
          <p className="type-body text-[#686868]">Hand-picked titles for your next read</p>
        </div>

        {/* List carousels */}
        {resolvedLists.map((list) => (
          <section key={list.id} className="flex flex-col gap-4">
            <BookCarousel books={list.books} heading={list.heading} />
          </section>
        ))}
      </main>
    </div>
  );
}
