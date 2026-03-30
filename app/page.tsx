import { TopNav } from "@/components/TopNav";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Tabs } from "@/components/home/Tabs";
import { BOOKS } from "@/lib/books";

export default function Home() {
  const tabItems = [
    { label: "All", count: 110 },
    { label: "Currently reading", count: 4 },
    { label: "Want to read", count: 28 },
    { label: "Finished", count: 71 },
    { label: "Didn’t finish", count: 8 },
    { label: "Favorites", count: 12 },
  ];

  const ol = (title: string) =>
    `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`;

  const toCarouselBook = (b: (typeof BOOKS)[0]) => ({
    slug: b.slug,
    title: b.title,
    author: b.author,
    coverTone: b.coverTone,
    coverUrl: ol(b.title),
  });

  const books = BOOKS.slice(0, 6).map(toCarouselBook);
  const booksRowTwo = BOOKS.slice(6, 12).map(toCarouselBook);
  const booksRowThree = BOOKS.slice(12, 18).map(toCarouselBook);

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav />
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
