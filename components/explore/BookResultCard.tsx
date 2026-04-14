import Link from "next/link";
import { CoverImage } from "@/components/CoverImage";
import { CardActionButtons } from "@/components/book/CardActionButtons";
import type { ShelfStatus } from "@/lib/shelf";

export type BookResult = {
  id: string;
  title: string;
  author: string;
  year?: number;
  publisher?: string;
  pages?: number;
  genres: string[];
  isbn?: string;
  coverUrl?: string;
  coverFallbackUrl?: string;
  coverLastResortUrl?: string;
  reason?: string;
};

export type CardShelfInfo = {
  status: ShelfStatus | null;
  isFavorite: boolean;
};

type Props = {
  book: BookResult;
  shelfInfo?: CardShelfInfo;
  isAuthenticated?: boolean;
};

export function BookResultCard({ book, shelfInfo, isAuthenticated }: Props) {
  const meta = [book.year, book.publisher, book.pages ? `${book.pages.toLocaleString()} pages` : undefined]
    .filter(Boolean)
    .join(" · ");

  const bookMeta = {
    bookId: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    isbn: book.isbn,
    pageCount: book.pages,
    genres: book.genres.length > 0 ? book.genres : undefined,
  };

  return (
    <article className="flex flex-col border border-black bg-[#CBDEE1]">
      <Link href={`/book/${book.id}`} className="flex gap-[57px] p-8 transition-opacity hover:opacity-90">
        {/* Cover */}
        <div
          className="relative shrink-0 overflow-hidden border border-black bg-[#8B9DAA]"
          style={{ width: "160px", aspectRatio: "2/3" }}
        >
          {book.coverUrl && (
            <CoverImage
              src={book.coverUrl}
              fallbackSrc={book.coverFallbackUrl}
              lastResortSrc={book.coverLastResortUrl}
              alt={`Cover of ${book.title}`}
              sizes="160px"
              placeholderTitle={book.title}
              placeholderAuthor={book.author}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <h2 className="font-ligconsolata text-[40px] leading-[1.1em] font-bold text-black">
            {book.title}
          </h2>
          <p className="font-ligconsolata text-[24px] leading-[1.049em] font-normal text-black">
            {book.author}
          </p>
          {meta && (
            <p className="font-ligconsolata text-[20px] leading-[1.049em] font-normal text-[#686868]">
              {meta}
            </p>
          )}
          {book.genres.length > 0 && (
            <p className="font-ligconsolata text-[16px] leading-[1.049em] font-normal text-[#686868]">
              {book.genres.join(", ")}
            </p>
          )}
          {book.reason && (
            <p className="font-ligconsolata text-[16px] leading-[1.5em] font-normal text-[#4A4A4A] mt-1 border-l-2 border-[#D79E2D] pl-3">
              {book.reason}
            </p>
          )}
        </div>
      </Link>

      {/* Action buttons — only for authenticated users */}
      {isAuthenticated && (
        <div className="px-8 pb-6">
          <CardActionButtons
            book={bookMeta}
            initialStatus={shelfInfo?.status ?? null}
            initialFavorite={shelfInfo?.isFavorite ?? false}
          />
        </div>
      )}
    </article>
  );
}
