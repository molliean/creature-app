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

      {/* ── Mobile layout ─────────────────────────────── */}
      <div className="flex flex-col md:hidden">
        {/* Row: cover + right column */}
        <div className="flex gap-3 p-4">
          {/* Cover */}
          <Link href={`/book/${book.id}`} className="shrink-0">
            <div
              className="relative overflow-hidden border border-black bg-[#8B9DAA]"
              style={{ width: "80px", aspectRatio: "2/3" }}
            >
              {book.coverUrl && (
                <CoverImage
                  src={book.coverUrl}
                  fallbackSrc={book.coverFallbackUrl}
                  lastResortSrc={book.coverLastResortUrl}
                  alt={`Cover of ${book.title}`}
                  sizes="80px"
                  placeholderTitle={book.title}
                  placeholderAuthor={book.author}
                />
              )}
            </div>
          </Link>

          {/* Right column: info + action buttons */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Link href={`/book/${book.id}`} className="flex flex-col gap-1 transition-opacity hover:opacity-90">
              <h2 className="font-ligconsolata text-[18px] leading-[1.1em] font-bold text-black">
                {book.title}
              </h2>
              <p className="font-ligconsolata text-[14px] leading-[1.049em] font-normal text-black">
                {book.author}
              </p>
              {meta && (
                <p className="font-ligconsolata text-[12px] leading-[1.049em] font-normal text-[#686868]">
                  {meta}
                </p>
              )}
              {book.genres.length > 0 && (
                <p className="font-ligconsolata text-[12px] leading-[1.049em] font-normal text-[#686868]">
                  {book.genres.join(", ")}
                </p>
              )}
            </Link>
            {isAuthenticated && (
              <CardActionButtons
                book={bookMeta}
                initialStatus={shelfInfo?.status ?? null}
                initialFavorite={shelfInfo?.isFavorite ?? false}
              />
            )}
          </div>
        </div>

        {/* Reason — full width below row */}
        {book.reason && (
          <p className="font-ligconsolata text-[13px] leading-[1.5em] font-normal text-[#4A4A4A] border-l-2 border-[#D79E2D] pl-3 mx-4 mb-4">
            {book.reason}
          </p>
        )}
      </div>

      {/* ── Desktop layout ────────────────────────────── */}
      <div className="hidden md:flex md:flex-col">
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

        {/* Action buttons */}
        {isAuthenticated && (
          <div className="px-8 pb-6">
            <CardActionButtons
              book={bookMeta}
              initialStatus={shelfInfo?.status ?? null}
              initialFavorite={shelfInfo?.isFavorite ?? false}
            />
          </div>
        )}
      </div>

    </article>
  );
}
