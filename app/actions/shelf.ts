"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  upsertBookStatus,
  setFavorite,
  removeBookFromShelf,
  type ShelfStatus,
} from "@/lib/shelf";

export type BookMeta = {
  bookId: string;
  title: string;
  author?: string;
  coverUrl?: string;
  isbn?: string;
  pageCount?: number;
  genres?: string[];
};

export async function setShelfStatus(
  book: BookMeta,
  status: ShelfStatus,
  isFavorite: boolean = false
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await upsertBookStatus(userId, book, status, isFavorite);
  revalidatePath("/home");
}

export async function toggleFavorite(
  book: BookMeta,
  isFavorite: boolean,
  currentStatus: ShelfStatus | null
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  if (currentStatus !== null) {
    // Book is on shelf — upsert to persist both status and new is_favorite
    await upsertBookStatus(userId, book, currentStatus, isFavorite);
  } else {
    // Book not yet on shelf — only update if a row already exists (no-op otherwise)
    await setFavorite(userId, book.bookId, isFavorite);
  }

  revalidatePath("/home");
}

export async function removeFromShelf(bookId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await removeBookFromShelf(userId, bookId);
  revalidatePath("/home");
}
