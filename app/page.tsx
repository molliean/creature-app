import { TopNav } from "@/components/TopNav";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Tabs } from "@/components/home/Tabs";

export default function Home() {
  const tabItems = [
    { label: "All", count: 110 },
    { label: "Currently reading", count: 4 },
    { label: "Want to read", count: 28 },
    { label: "Finished", count: 71 },
    { label: "Didn’t finish", count: 8 },
    { label: "Favorites", count: 12 },
  ];

  const books = [
    { title: "The Night Circus", author: "Erin Morgenstern", coverTone: "bg-[#3E5868]" },
    { title: "Klara and the Sun", author: "Kazuo Ishiguro", coverTone: "bg-[#7A5235]" },
    { title: "Anna Karenina", author: "Leo Tolstoy", coverTone: "bg-[#6B3E4A]" },
    { title: "Pachinko", author: "Min Jin Lee", coverTone: "bg-[#2D5A52]" },
    { title: "Martyr!", author: "Kaveh Akbar", coverTone: "bg-[#495164]" },
    { title: "The Overstory", author: "Richard Powers", coverTone: "bg-[#7B5A3D]" },
  ];

  const booksRowTwo = [
    { title: "Beloved", author: "Toni Morrison", coverTone: "bg-[#734E58]" },
    { title: "The Idiot", author: "Elif Batuman", coverTone: "bg-[#5B6A82]" },
    { title: "A Little Life", author: "Hanya Yanagihara", coverTone: "bg-[#6B5A46]" },
    { title: "The Goldfinch", author: "Donna Tartt", coverTone: "bg-[#566B4B]" },
    { title: "Outline", author: "Rachel Cusk", coverTone: "bg-[#48596A]" },
    { title: "Real Life", author: "Brandon Taylor", coverTone: "bg-[#6F4F41]" },
  ];

  const booksRowThree = [
    { title: "Trust", author: "Hernan Diaz", coverTone: "bg-[#50646B]" },
    { title: "The Bee Sting", author: "Paul Murray", coverTone: "bg-[#6A5D49]" },
    { title: "Normal People", author: "Sally Rooney", coverTone: "bg-[#4A6071]" },
    { title: "Demon Copperhead", author: "Barbara Kingsolver", coverTone: "bg-[#66503D]" },
    { title: "Piranesi", author: "Susanna Clarke", coverTone: "bg-[#4C5D52]" },
    { title: "Open Water", author: "Caleb Azumah Nelson", coverTone: "bg-[#6B5361]" },
  ];

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
