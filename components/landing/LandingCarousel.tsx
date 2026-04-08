import { BOOKS } from "@/lib/books";

// ---------------------------------------------------------------------------
// Build cover list from static BOOKS data
// OL returns a transparent 1×1 GIF on miss (no ?default=false here) so the
// coloured tile background shows through — no broken-image icons.
// ---------------------------------------------------------------------------

const covers = BOOKS.map((book) => ({
  url: book.localCover
    ? book.localCover
    : `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
  tone: book.coverTone, // e.g. "bg-[#6B3E4A]"
  title: book.title,
}));

// Split into two rows of 9
const row1 = covers.slice(0, 9);
const row2 = covers.slice(9, 18);

// ---------------------------------------------------------------------------
// Cover tile
// ---------------------------------------------------------------------------

function CoverTile({ url, tone, title }: { url: string; tone: string; title: string }) {
  return (
    <div
      // height fills the row; width auto-computed from aspect-ratio
      className={`relative shrink-0 overflow-hidden ${tone}`}
      style={{ aspectRatio: "2/3", height: "100%" }}
    >
      <img
        src={url}
        alt={title}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scrolling row
// Covers are duplicated so translateX(-50%) loops seamlessly regardless of
// individual cover width (both halves are identical in total width).
// ---------------------------------------------------------------------------

function CarouselRow({
  books,
  direction,
}: {
  books: typeof row1;
  direction: "left" | "right";
}) {
  const doubled = [...books, ...books];

  return (
    // Row wrapper: clips overflow and fills its flex-1 height
    <div className="relative flex-1 overflow-hidden">
      <div
        className={`flex h-full gap-[3px] ${
          direction === "left" ? "carousel-left" : "carousel-right"
        }`}
      >
        {doubled.map((cover, i) => (
          <CoverTile key={i} {...cover} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function LandingCarousel() {
  return (
    // Outer: fills the preview box, clips overflow, adds left/right vignette
    <div className="absolute inset-0 flex flex-col gap-[3px]">
      <CarouselRow books={row1} direction="left" />
      <CarouselRow books={row2} direction="right" />
    </div>
  );
}
