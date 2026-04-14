import { getAdminClient } from "./supabase";

export type ShelfStatus = "reading" | "want_to_read" | "finished" | "dnf";

export type ShelfBook = {
  id: string;
  bookId: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  isbn: string | null;
  status: ShelfStatus;
  isFavorite: boolean;
  addedAt: string;
  updatedAt: string;
};

export type ShelfInfo = {
  status: ShelfStatus | null;
  isFavorite: boolean;
};

type BookInput = {
  bookId: string;
  title: string;
  author?: string;
  coverUrl?: string;
  isbn?: string;
  pageCount?: number;
  genres?: string[];
};

function rowToShelfBook(row: Record<string, unknown>): ShelfBook {
  return {
    id: row.id as string,
    bookId: row.book_id as string,
    title: row.title as string,
    author: (row.author as string) ?? null,
    coverUrl: (row.cover_url as string) ?? null,
    isbn: (row.isbn as string) ?? null,
    status: row.status as ShelfStatus,
    isFavorite: (row.is_favorite as boolean) ?? false,
    addedAt: row.added_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getUserShelf(userId: string): Promise<ShelfBook[]> {
  const db = getAdminClient();
  const { data, error } = await db
    .from("shelf_books")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToShelfBook);
}

export async function isBookOnShelf(
  userId: string,
  bookId: string
): Promise<ShelfInfo> {
  const db = getAdminClient();
  const { data, error } = await db
    .from("shelf_books")
    .select("status, is_favorite")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return {
    status: data ? (data.status as ShelfStatus) : null,
    isFavorite: data ? (data.is_favorite as boolean) ?? false : false,
  };
}

export async function upsertBookStatus(
  userId: string,
  book: BookInput,
  status: ShelfStatus,
  isFavorite: boolean = false
): Promise<void> {
  const db = getAdminClient();
  const { error } = await db
    .from("shelf_books")
    .upsert(
      {
        user_id: userId,
        book_id: book.bookId,
        title: book.title,
        author: book.author ?? null,
        cover_url: book.coverUrl ?? null,
        isbn: book.isbn ?? null,
        page_count: book.pageCount ?? null,
        genres: book.genres ?? null,
        status,
        is_favorite: isFavorite,
        date_finished: status === "finished" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_id" }
    );

  if (error) throw new Error(error.message);
}

export async function setFavorite(
  userId: string,
  bookId: string,
  isFavorite: boolean
): Promise<void> {
  const db = getAdminClient();
  const { error } = await db
    .from("shelf_books")
    .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
}

export async function removeBookFromShelf(
  userId: string,
  bookId: string
): Promise<void> {
  const db = getAdminClient();
  const { error } = await db
    .from("shelf_books")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
}
