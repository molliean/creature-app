import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { ActionButtons } from "@/components/book/ActionButtons";
import { getBookBySlug } from "@/lib/books";

const AFFILIATE_ID = "12345";

const BOOK_DESCRIPTION = `Tolstoy's epic novel of love, destiny and self-destruction, in a gorgeous new clothbound edition from Penguin Classics. Anna Karenina seems to have everything - beauty, wealth, popularity and an adored son. But she feels that her life is empty until the moment she encounters the impetuous officer Count Vronsky. Their subsequent affair scandalizes society and family alike and soon brings jealously and bitterness in its wake. Contrasting with this tale of love and self-destruction is the vividly observed story of Levin, a man striving to find contentment and a meaning to his life - and also a self-portrait of Tolstoy himself. This acclaimed modern translation by Richard Pevear and Larissa Volokhonsky won the PEN/ Book of the Month Club Translation Prize in 2001. Their translation is accompanied in this edition by an introduction by Richard Pevear and a preface by John Bayley 'The new and brilliantly witty translation by Richard Pevear and Larissa Volokhonsky is a must' - Lisa Appignanesi, Independent, Books of the Year 'Pevear and Volokhonsky are at once scrupulous translators and vivid stylists of English, and their superb rendering allows us, as perhaps never before, to grasp the palpability of Tolstoy's "characters, acts, situations"' - James Wood, New Yorker`;

const AUTHOR_INFO = `Count Leo Tolstoy was born in 1828 at Yasnaya Polyana, in the Tula province, and educated privately. He studied Oriental languages and law at the University of Kazan, then led a life of pleasure until 1851 when he joined an artillery regiment in the Caucasus. He took part in the Crimean War and after the defence of Sebastopol he wrote The Sebastopol Sketches (1855-6), which established his reputation. After a period in St Petersburg and abroad, where he studied educational methods for use in his school for peasant children in Yasnaya Polyana, he married Sofya Andreyevna Behrs in 1862. The next fifteen years was a period of great happiness; they had thirteen children, and Tolstoy managed his vast estates in the Volga Steppes, continued his educational projects, cared for his peasants and wrote War and Peace (1869) and Anna Karenina (1877). A Confession (1879-82) marked a spiritual crisis in his life; he became an extreme moralist and in a series of pamphlets after 1880 expressed his rejection of state and church, indictment of the weaknesses of the flesh and denunciation of private property. His teaching earned him numerous followers at home and abroad, but also much opposition, and in 1901 he was excommuincated by the Russian Holy Synod. He died in 1910, in the course of a dramamtic flight from home, at the small railway station of Astapovo.`;

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) notFound();

  const coverUrl = book.localCover ?? `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg`;
  const shopUrl = `https://bookshop.org/a/${AFFILIATE_ID}/${book.isbn}`;

  return (
    <div className="h-screen w-full overflow-hidden bg-[#CBDEE1] text-black">
      <TopNav />
      <div className="flex h-[calc(100vh-69px)] gap-12 px-8 py-8">

        {/* Cover — fills remaining height with 32px padding top/bottom */}
        <div className="relative shrink-0 overflow-hidden border border-black" style={{ aspectRatio: "2/3", height: "100%" }}>
          <Image
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="33vw"
            priority
          />
        </div>

        {/* Right column — scrollable */}
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Title + author + metadata */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-shippori-mincho text-[52px] leading-[1.2em] font-normal text-black">
                {book.title}
              </h1>
              <p className="font-ligconsolata text-[22px] leading-[1.049em] font-normal text-black">
                {book.author}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{book.year}</span>
              <span className="text-[#686868]">·</span>
              <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{book.pages.toLocaleString()} pages</span>
              <span className="text-[#686868]">·</span>
              <span className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">{book.genres.join(", ")}</span>
            </div>
            {book.readingStatus && (
              <p className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">
                {book.readingStatus.status === "finished" && book.readingStatus.date
                  ? `Finished on ${book.readingStatus.date}`
                  : book.readingStatus.status === "reading"
                  ? "Currently reading"
                  : book.readingStatus.status === "want"
                  ? "Want to read"
                  : "Didn't finish"}
              </p>
            )}
          </div>

          {/* Action buttons + buy link */}
          <div className="flex flex-col gap-4">
            <ActionButtons initialStatus={book.readingStatus?.status ?? null} />
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
          </div>

          {/* Book description */}
          <div className="flex flex-col gap-3 pr-24">
            <h2 className="font-shippori-mincho text-[22px] leading-[1.3em] font-normal text-black">
              About this book
            </h2>
            <p className="font-ligconsolata text-[15px] leading-[1.7em] font-normal text-[#4A4A4A]">
              {BOOK_DESCRIPTION}
            </p>
          </div>

          {/* Author info */}
          <div className="flex flex-col gap-3 pr-24">
            <h2 className="font-shippori-mincho text-[22px] leading-[1.3em] font-normal text-black">
              About the author
            </h2>
            <p className="font-ligconsolata text-[15px] leading-[1.7em] font-normal text-[#4A4A4A]">
              {AUTHOR_INFO}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
