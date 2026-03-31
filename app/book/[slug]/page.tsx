import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { ActionButtons } from "@/components/book/ActionButtons";
import { CoverImage } from "@/components/CoverImage";
import { getBookBySlug } from "@/lib/books";
import { getBookById, searchBooks, olCoverUrl, googleCoverUrl, type GoogleBook } from "@/lib/googleBooks";

const AFFILIATE_ID = "12345";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try static book list first
  const staticBook = getBookBySlug(slug);

  let googleBook: GoogleBook | null = null;

  if (staticBook?.isbn) {
    // Fetch real description from Google Books using the ISBN
    const results = await searchBooks(`isbn:${staticBook.isbn}`, 1);
    googleBook = results[0] ?? null;
  } else if (!staticBook) {
    // Slug is likely a Google Books volume ID — fetch directly
    googleBook = await getBookById(slug);
    if (!googleBook) notFound();
  }

  // Resolve display data — prefer static metadata, real description from Google
  const title = staticBook?.title ?? googleBook?.title ?? "Unknown Title";
  const author = staticBook?.author ?? googleBook?.authors.join(", ") ?? "Unknown Author";
  const year = staticBook?.year ?? googleBook?.year;
  const pages = staticBook?.pages ?? googleBook?.pageCount;
  const genres = staticBook?.genres ?? googleBook?.categories ?? [];
  const isbn = staticBook?.isbn ?? googleBook?.isbn;
  const description = googleBook?.description ?? staticBook?.synopsis;
  const readingStatus = staticBook?.readingStatus ?? null;

  // Cover chain: local file → OL large → OL medium → Google Books fife
  const olLarge  = isbn ? olCoverUrl(isbn, "L") : null;
  const olMedium = isbn ? olCoverUrl(isbn, "M") : null;
  const googleLast = googleBook?.coverLastResortUrl
    ?? (googleBook?.id ? googleCoverUrl(googleBook.id) : null);

  const coverUrl           = staticBook?.localCover ?? olLarge ?? googleBook?.coverUrl;
  const coverFallbackUrl   = staticBook?.localCover ? undefined : olMedium ?? undefined;
  const coverLastResortUrl = staticBook?.localCover ? undefined : googleLast ?? undefined;

  const shopUrl = isbn ? `https://bookshop.org/a/${AFFILIATE_ID}/${isbn}` : null;

  return (
    <div className="h-screen w-full overflow-hidden bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <div className="flex h-[calc(100vh-69px)] gap-12 px-8 py-8">

        {/* Cover — fills remaining height */}
        <div
          className="relative shrink-0 overflow-hidden border border-black bg-[#8B9DAA]"
          style={{ aspectRatio: "2/3", height: "100%" }}
        >
          {coverUrl && (
            <CoverImage
              src={coverUrl}
              fallbackSrc={coverFallbackUrl}
              lastResortSrc={coverLastResortUrl}
              alt={`Cover of ${title}`}
              sizes="33vw"
              priority
              placeholderTitle={title}
              placeholderAuthor={author}
            />
          )}
        </div>

        {/* Right column — scrollable */}
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Title + author + metadata */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-shippori-mincho text-[52px] leading-[1.2em] font-normal text-black">
                {title}
              </h1>
              <p className="font-ligconsolata text-[22px] leading-[1.049em] font-normal text-black">
                {author}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {year && (
                <>
                  <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{year}</span>
                  <span className="text-[#686868]">·</span>
                </>
              )}
              {pages && (
                <>
                  <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{pages.toLocaleString()} pages</span>
                  <span className="text-[#686868]">·</span>
                </>
              )}
              {genres.length > 0 && (
                <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{genres.join(", ")}</span>
              )}
            </div>
            {readingStatus && (
              <p className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">
                {readingStatus.status === "finished" && readingStatus.date
                  ? `Finished on ${readingStatus.date}`
                  : readingStatus.status === "reading"
                  ? "Currently reading"
                  : readingStatus.status === "want"
                  ? "Want to read"
                  : "Didn't finish"}
              </p>
            )}
          </div>

          {/* Action buttons + buy link */}
          <div className="flex flex-col gap-4">
            <ActionButtons initialStatus={readingStatus?.status ?? null} />
            {shopUrl && (
              <Link
                href={shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ligconsolata inline-flex w-fit items-center gap-2 border border-[#989898] bg-[#D79E2D] px-5 py-3 text-[16px] leading-[1.049em] font-normal text-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80"
              >
                Buy on Bookshop.org
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          {/* Book description */}
          {description && (
            <div className="flex flex-col gap-3 pr-24">
              <h2 className="font-shippori-mincho text-[22px] leading-[1.3em] font-normal text-black">
                About this book
              </h2>
              <p className="font-ligconsolata text-[15px] leading-[1.7em] font-normal text-[#4A4A4A]">
                {description}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
