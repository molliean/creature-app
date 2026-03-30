import Link from "next/link";
import { CoverImage } from "@/components/CoverImage";

type BookItem = {
  slug: string;
  title: string;
  author: string;
  coverTone: string;
  coverUrl?: string;
  coverFallbackUrl?: string;
};

type BookCarouselProps = {
  books: BookItem[];
};

export function BookCarousel({ books }: BookCarouselProps) {
  return (
    <div className="flex w-max gap-[3px]">
      {books.map((book) => (
        <article key={book.title} className="flex flex-col gap-[10px] p-[10px]">
          <Link href={`/book/${book.slug}`} className="block">
            <div
              className={`h-[435px] w-[290px] border border-black relative overflow-hidden ${book.coverUrl ? "" : book.coverTone}`}
            >
              {book.coverUrl ? (
                <CoverImage
                  src={book.coverUrl}
                  fallbackSrc={book.coverFallbackUrl}
                  alt={`Cover of ${book.title}`}
                  sizes="290px"
                  placeholderTitle={book.title}
                  placeholderAuthor={book.author}
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  <div className="absolute bottom-2 left-2 right-2 font-ligconsolata text-[12px] text-white/90">
                    {book.title}
                  </div>
                </>
              )}
            </div>
          </Link>
          <div className="max-w-[290px]">
            <p className="font-ligconsolata truncate text-[16px] leading-[1.049em] font-normal text-black">
              {book.title}
            </p>
            <p className="font-ligconsolata truncate text-[12px] leading-[1.049em] font-normal text-[#686868]">
              {book.author}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
