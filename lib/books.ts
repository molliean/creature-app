export type Book = {
  slug: string;
  title: string;
  author: string;
  year: number;
  pages: number;
  genres: string[];
  isbn: string;
  coverTone: string;
  localCover?: string;
  synopsis?: string;
  readingStatus?: {
    status: "finished" | "reading" | "want" | "dnf";
    date?: string;
  };
};

export const BOOKS: Book[] = [
  {
    slug: "anna-karenina",
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    year: 1878,
    pages: 864,
    genres: ["Classic", "Literary fiction"],
    isbn: "9780143035008",
    coverTone: "bg-[#6B3E4A]",
    localCover: "/9781454959595.jpg",
    synopsis:
      "Acclaimed by many as the world's greatest novel, Anna Karenina provides a vivid portrait of Russian society in the nineteenth century, and a story of love and loss that has never been surpassed.",
    readingStatus: { status: "finished", date: "March 15" },
  },
  {
    slug: "the-night-circus",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    year: 2011,
    pages: 387,
    genres: ["Fantasy", "Literary fiction"],
    isbn: "9780307744432",
    coverTone: "bg-[#3E5868]",
  },
  {
    slug: "klara-and-the-sun",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    year: 2021,
    pages: 307,
    genres: ["Literary fiction", "Science fiction"],
    isbn: "9780571364886",
    coverTone: "bg-[#7A5235]",
  },
  {
    slug: "pachinko",
    title: "Pachinko",
    author: "Min Jin Lee",
    year: 2017,
    pages: 496,
    genres: ["Historical fiction", "Literary fiction"],
    isbn: "9781455563937",
    coverTone: "bg-[#2D5A52]",
  },
  {
    slug: "martyr",
    title: "Martyr!",
    author: "Kaveh Akbar",
    year: 2024,
    pages: 336,
    genres: ["Literary fiction"],
    isbn: "9781984823991",
    coverTone: "bg-[#495164]",
  },
  {
    slug: "the-overstory",
    title: "The Overstory",
    author: "Richard Powers",
    year: 2018,
    pages: 512,
    genres: ["Literary fiction", "Nature"],
    isbn: "9780393356687",
    coverTone: "bg-[#7B5A3D]",
  },
  {
    slug: "beloved",
    title: "Beloved",
    author: "Toni Morrison",
    year: 1987,
    pages: 321,
    genres: ["Historical fiction", "Literary fiction"],
    isbn: "9781400033416",
    coverTone: "bg-[#734E58]",
  },
  {
    slug: "the-idiot",
    title: "The Idiot",
    author: "Elif Batuman",
    year: 2017,
    pages: 423,
    genres: ["Literary fiction", "Coming-of-age"],
    isbn: "9781594205613",
    coverTone: "bg-[#5B6A82]",
  },
  {
    slug: "a-little-life",
    title: "A Little Life",
    author: "Hanya Yanagihara",
    year: 2015,
    pages: 720,
    genres: ["Literary fiction", "Contemporary fiction"],
    isbn: "9780804172707",
    coverTone: "bg-[#6B5A46]",
  },
  {
    slug: "the-goldfinch",
    title: "The Goldfinch",
    author: "Donna Tartt",
    year: 2013,
    pages: 771,
    genres: ["Literary fiction", "Coming-of-age"],
    isbn: "9780316055437",
    coverTone: "bg-[#566B4B]",
  },
  {
    slug: "outline",
    title: "Outline",
    author: "Rachel Cusk",
    year: 2014,
    pages: 256,
    genres: ["Literary fiction", "Autofiction"],
    isbn: "9780374228347",
    coverTone: "bg-[#48596A]",
  },
  {
    slug: "real-life",
    title: "Real Life",
    author: "Brandon Taylor",
    year: 2020,
    pages: 352,
    genres: ["Literary fiction", "Contemporary fiction"],
    isbn: "9780525559344",
    coverTone: "bg-[#6F4F41]",
  },
  {
    slug: "trust",
    title: "Trust",
    author: "Hernan Diaz",
    year: 2022,
    pages: 416,
    genres: ["Literary fiction", "Historical fiction"],
    isbn: "9780593420935",
    coverTone: "bg-[#50646B]",
  },
  {
    slug: "the-bee-sting",
    title: "The Bee Sting",
    author: "Paul Murray",
    year: 2023,
    pages: 656,
    genres: ["Literary fiction", "Family drama"],
    isbn: "9780374110345",
    coverTone: "bg-[#6A5D49]",
  },
  {
    slug: "normal-people",
    title: "Normal People",
    author: "Sally Rooney",
    year: 2018,
    pages: 266,
    genres: ["Literary fiction", "Romance"],
    isbn: "9781984822185",
    coverTone: "bg-[#4A6071]",
  },
  {
    slug: "demon-copperhead",
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    year: 2022,
    pages: 560,
    genres: ["Literary fiction", "Historical fiction"],
    isbn: "9780063251922",
    coverTone: "bg-[#66503D]",
  },
  {
    slug: "piranesi",
    title: "Piranesi",
    author: "Susanna Clarke",
    year: 2020,
    pages: 272,
    genres: ["Fantasy", "Literary fiction"],
    isbn: "9781635575637",
    coverTone: "bg-[#4C5D52]",
  },
  {
    slug: "open-water",
    title: "Open Water",
    author: "Caleb Azumah Nelson",
    year: 2021,
    pages: 160,
    genres: ["Literary fiction", "Romance"],
    isbn: "9780802158758",
    coverTone: "bg-[#6B5361]",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
