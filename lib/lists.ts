export type ListBook = {
  title: string;
  author: string;
};

export type BookList = {
  id: string;
  heading: string;
  books: ListBook[];
};

export const LISTS: BookList[] = [
  {
    id: "new-and-noteworthy",
    heading: "New & Noteworthy",
    books: [
      { title: "Lost Lambs",    author: "Madeline Cash" },
      { title: "Down Time",     author: "Andrew Martin" },
      { title: "Brawler: Stories", author: "Lauren Groff" },
      { title: "Picture of Nobody", author: "Philip Owens" },
      { title: "The Book of I", author: "David Greig" },
      { title: "The Correspondent", author: "Virginia Evans" },
    ],
  },
  {
    id: "books-that-became-films",
    heading: "Books That Became Films",
    books: [
      { title: "Dune",                  author: "Frank Herbert" },
      { title: "Inherent Vice",         author: "Thomas Pynchon" },
      { title: "The Age of Innocence",  author: "Edith Wharton" },
      { title: "Wuthering Heights",     author: "Emily Bronte" },
      { title: "No Country for Old Men", author: "Cormac McCarthy" },
      { title: "Misery",                author: "Stephen King" },
    ],
  },
  {
    id: "translated-fiction",
    heading: "Translated in Translation",
    books: [
      { title: "Sisters in Yellow",              author: "Mieko Kawakami" },
      { title: "On the Calculation of Volume Vol I", author: "Solvej Balle" },
      { title: "My Brilliant Friend",            author: "Elena Ferrante" },
      { title: "The Savage Detectives",          author: "Roberto Bolano" },
      { title: "The Three-Body Problem",         author: "Liu Cixin" },
      { title: "I Who Have Never Known Men",     author: "Jacqueline Harpman" },
    ],
  },
  {
    id: "classics-revisited",
    heading: "Classics Revisited",
    books: [
      { title: "East of Eden",   author: "John Steinbeck" },
      { title: "Anna Karenina",  author: "Leo Tolstoy" },
      { title: "The Sea, The Sea", author: "Iris Murdoch" },
      { title: "Middlemarch",    author: "George Eliot" },
      { title: "Frankenstein",   author: "Mary Shelley" },
      { title: "Beloved",        author: "Toni Morrison" },
    ],
  },
  {
    id: "audiobooks-read-by-author",
    heading: "Audiobooks Read by the Author",
    books: [
      { title: "Motherhood",              author: "Sheila Heti" },
      { title: "On Writing",              author: "Stephen King" },
      { title: "Kitchen Confidential",    author: "Anthony Bourdain" },
      { title: "Postcards from the Edge", author: "Carrie Fisher" },
      { title: "Calypso",                 author: "David Sedaris" },
      { title: "Born a Crime",            author: "Trevor Noah" },
    ],
  },
  {
    id: "pulitzer-prize-winners",
    heading: "Pulitzer Prize Winners",
    books: [
      { title: "The Orphan Master's Son",        author: "Adam Johnson" },
      { title: "The Goldfinch",                  author: "Donna Tartt" },
      { title: "A Visit from the Goon Squad",    author: "Jennifer Egan" },
      { title: "Lonesome Dove",                  author: "Larry McMurtry" },
      { title: "The Executioner's Song",         author: "Norman Mailer" },
      { title: "The Underground Railroad",       author: "Colson Whitehead" },
    ],
  },
  {
    id: "riveting-memoirs",
    heading: "Riveting Memoirs",
    books: [
      { title: "Famesick",                       author: "Lena Dunham" },
      { title: "I Regret Almost Everything",     author: "Keith McNally" },
      { title: "Strangers: A Memoir of Marriage", author: "Belle Burden" },
      { title: "Role Models",                    author: "John Waters" },
      { title: "Just Kids",                      author: "Patti Smith" },
      { title: "The Year of Magical Thinking",   author: "Joan Didion" },
    ],
  },
  {
    id: "debut-novels",
    heading: "Debut Novels",
    books: [
      { title: "White Teeth",             author: "Zadie Smith" },
      { title: "Severance",               author: "Ling Ma" },
      { title: "Swamplandia!",            author: "Karen Russell" },
      { title: "Convenience Store Woman", author: "Sayaka Murata" },
      { title: "Saving Agnes",            author: "Rachel Cusk" },
      { title: "Neuromancer",             author: "William Gibson" },
    ],
  },
  {
    id: "read-in-a-day",
    heading: "Read in a Day",
    books: [
      { title: "Time Is a Mother",                   author: "Ocean Vuong" },
      { title: "An Elderly Lady Is Up to No Good",   author: "Helene Tursten" },
      { title: "Giovanni's Room",                    author: "James Baldwin" },
      { title: "Train Dreams",                       author: "Denis Johnson" },
      { title: "Near to the Wild Heart",             author: "Clarice Lispector" },
      { title: "Who Will Run the Frog Hospital?",    author: "Lorrie Moore" },
    ],
  },
];
