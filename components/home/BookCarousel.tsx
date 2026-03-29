type BookItem = {
  title: string;
  author: string;
  coverTone: string;
};

type BookCarouselProps = {
  books: BookItem[];
};

export function BookCarousel({ books }: BookCarouselProps) {
  return (
    <div className="flex w-max gap-[3px]">
      {books.map((book) => (
        <article key={book.title} className="flex flex-col gap-[10px] p-[10px]">
          <div
            className={`h-[435px] w-[290px] border border-black ${book.coverTone} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            <div className="absolute bottom-2 left-2 right-2 text-[12px] text-white/90">
              Placeholder cover
            </div>
          </div>
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
