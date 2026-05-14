import { verifySessionCookie } from "@/lib/auth/firebase-session";
import { dummyJsonUserFormSchema } from "@/lib/validation/user.schema";
import {
  createDirectoryUser,
  directoryDocToListItem,
  directoryDocToPublicRecord,
  listAllDirectoryUsers,
} from "@/lib/users/directory-repository";
import { queryDirectoryListItems } from "@/lib/users/directory-query";
import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const limit = Math.min(
    500,
    Math.max(0, Number.parseInt(searchParams.get("limit") ?? "30", 10) || 0)
  );
  const skip = Math.max(0, Number.parseInt(searchParams.get("skip") ?? "0", 10) || 0);
  const sortBy = searchParams.get("sortBy") ?? "id";
  const order =
    searchParams.get("order") === "desc" ? ("desc" as const) : ("asc" as const);

  const rows = await listAllDirectoryUsers();
  const items = rows.map((r) => directoryDocToListItem(r.id, r.data));
  const { users, total } = queryDirectoryListItems(items, {
    q: q || undefined,
    sortBy,
    order,
    skip,
    limit: limit <= 0 ? 0 : limit,
  });

  return NextResponse.json(
    { users, total },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  let jsonBody: unknown;
  try {
    jsonBody = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = dummyJsonUserFormSchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const created = await createDirectoryUser(parsed.data);
    return NextResponse.json(
      directoryDocToPublicRecord(created.id, created.data),
      { status: 201 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not create user.";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
