import { getAdminClient } from "./supabase";

export type ShelfStatus = "reading" | "want_to_read" | "finished" | "dnf" | "favorite";

export type ShelfBook = {
  id: string;
  bookId: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  isbn: string | null;
  status: ShelfStatus;
  addedAt: string;
  updatedAt: string;
};

type BookInput = {
  bookId: string;
  title: string;
  author?: string;
  coverUrl?: string;
  isbn?: string;
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
): Promise<ShelfStatus | null> {
  const db = getAdminClient();
  const { data, error } = await db
    .from("shelf_books")
    .select("status")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? (data.status as ShelfStatus) : null;
}

export async function upsertBookStatus(
  userId: string,
  book: BookInput,
  status: ShelfStatus
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
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_id" }
    );

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
