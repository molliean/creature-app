"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { upsertBookStatus, removeBookFromShelf, type ShelfStatus } from "@/lib/shelf";

export type BookMeta = {
  bookId: string;
  title: string;
  author?: string;
  coverUrl?: string;
  isbn?: string;
};

export async function setShelfStatus(
  book: BookMeta,
  status: ShelfStatus
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await upsertBookStatus(userId, book, status);
  revalidatePath("/home");
}

export async function removeFromShelf(bookId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await removeBookFromShelf(userId, bookId);
  revalidatePath("/home");
}
