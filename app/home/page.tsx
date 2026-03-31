import { TopNav } from "@/components/TopNav";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Tabs } from "@/components/home/Tabs";
import { BOOKS } from "@/lib/books";
import { getCoverUrlByIsbn } from "@/lib/googleBooks";

export default async function Home() {
  const tabItems = [
    { label: "All", count: 110 },
    { label: "Currently reading", count: 4 },
    { label: "Want to read", count: 28 },
    { label: "Finished", count: 71 },
    { label: "Didn't finish", count: 8 },
    { label: "Favorites", count: 12 },
  ];

  // Fetch Google Books covers for all books in parallel
  const displayBooks = BOOKS.slice(0, 18);
  const googleCovers = await Promise.all(
    displayBooks.map((b) =>
      b.localCover
        ? Promise.resolve(undefined)
        : getCoverUrlByIsbn(b.isbn, { title: b.title, author: b.author })
    )
  );

  const toCarouselBook = (b: (typeof BOOKS)[0], i: number) => {
    const gc = googleCovers[i];
    return {
      slug: b.slug,
      title: b.title,
      author: b.author,
      coverTone: b.coverTone,
      coverUrl: b.localCover ?? gc?.primary,
      coverFallbackUrl: b.localCover ? undefined : gc?.fallback,
      coverLastResortUrl: b.localCover ? undefined : gc?.lastResort,
    };
  };

  const books        = displayBooks.slice(0,  6).map((b, i) => toCarouselBook(b, i));
  const booksRowTwo   = displayBooks.slice(6, 12).map((b, i) => toCarouselBook(b, i + 6));
  const booksRowThree = displayBooks.slice(12, 18).map((b, i) => toCarouselBook(b, i + 12));

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <main className="flex min-h-[982px] w-full flex-col gap-[17px]">
        <section className="flex w-full flex-col gap-[17px] pl-6">
          <div className="flex items-center justify-start gap-[10px] p-[10px]">
            <h1 className="font-shippori-mincho text-[40px] leading-[1.448em] font-normal text-black">
              My Bookshelf
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            <Tabs activeIndex={0} items={tabItems} />

            <div className="flex flex-col gap-9 pl-3">
              <div className="w-full overflow-x-auto overflow-y-hidden pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <BookCarousel books={books} />
              </div>
              <div className="w-full overflow-x-auto overflow-y-hidden pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <BookCarousel books={booksRowTwo} />
              </div>
              <div className="w-full overflow-x-auto overflow-y-hidden pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <BookCarousel books={booksRowThree} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
