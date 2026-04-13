import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAdminClient } from "@/lib/supabase";
import type { ShelfStatus } from "@/lib/shelf";

export type ShelfStatusMap = Record<string, { status: ShelfStatus | null; isFavorite: boolean }>;

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({});

  const bookIdsParam = request.nextUrl.searchParams.get("bookIds") ?? "";
  const bookIds = bookIdsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (bookIds.length === 0) return NextResponse.json({});

  const db = getAdminClient();
  const { data, error } = await db
    .from("shelf_books")
    .select("book_id, status, is_favorite")
    .eq("user_id", userId)
    .in("book_id", bookIds);

  if (error) return NextResponse.json({});

  const result: ShelfStatusMap = {};
  for (const row of data ?? []) {
    result[row.book_id as string] = {
      status: (row.status as ShelfStatus) ?? null,
      isFavorite: (row.is_favorite as boolean) ?? false,
    };
  }
  return NextResponse.json(result);
}
