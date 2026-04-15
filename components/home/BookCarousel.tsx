import Link from "next/link";
import { CoverImage } from "@/components/CoverImage";

type BookItem = {
  slug: string;
  title: string;
  author: string;
  coverTone: string;
  coverUrl?: string;
  coverFallbackUrl?: string;
  coverLastResortUrl?: string;
};

type BookCarouselProps = {
  books: BookItem[];
  heading?: string;
};

export function BookCarousel({ books, heading }: BookCarouselProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 md:gap-3 overflow-hidden">
      {heading && (
        <h2 className="type-h3 pl-[10px] text-[#1A1A1A] text-[12px] md:text-[24px]">
          {heading}
          <span className="md:hidden type-h3 font-normal text-[#1a1a1a] ml-1.5">({books.length})</span>
        </h2>
      )}
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-[3px]">
          {books.map((book) => (
            <article key={book.slug} className="flex flex-col gap-[10px] p-[10px]">
              <Link href={`/book/${book.slug}`} className="block">
                <div
                  className={`h-[180px] w-[120px] md:h-[435px] md:w-[290px] border border-black relative overflow-hidden ${book.coverUrl ? "" : book.coverTone}`}
                >
                  {book.coverUrl ? (
                    <CoverImage
                      src={book.coverUrl}
                      fallbackSrc={book.coverFallbackUrl}
                      lastResortSrc={book.coverLastResortUrl}
                      alt={`Cover of ${book.title}`}
                      sizes="(max-width: 768px) 120px, 290px"
                      placeholderTitle={book.title}
                      placeholderAuthor={book.author}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                      <div className="absolute bottom-2 left-2 right-2 type-label text-white/90">
                        {book.title}
                      </div>
                    </>
                  )}
                </div>
              </Link>
              <div className="w-[120px] md:max-w-[290px] md:w-auto">
                <p className="font-dm-sans text-[13px] md:text-[16px] leading-[1.3em] truncate text-black">
                  {book.title}
                </p>
                <p className="font-dm-sans text-[12px] md:text-[15px] leading-[1.3em] truncate text-[#686868]">
                  {book.author}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
