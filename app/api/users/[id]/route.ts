import { verifySessionCookie } from "@/lib/auth/firebase-session";
import { dummyJsonUserFormSchema } from "@/lib/validation/user.schema";
import {
  deleteDirectoryUser,
  directoryDocToPublicRecord,
  getDirectoryUserById,
  updateDirectoryUser,
} from "@/lib/users/directory-repository";
import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

type RouteContext = { params: Promise<{ id: string }> };

function invalidId() {
  return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
}

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { id } = await ctx.params;
  if (!id.trim()) return invalidId();

  const row = await getDirectoryUserById(id);
  if (!row) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json(directoryDocToPublicRecord(row.id, row.data), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { id } = await ctx.params;
  if (!id.trim()) return invalidId();

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

  const updated = await updateDirectoryUser(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json(directoryDocToPublicRecord(updated.id, updated.data));
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { id } = await ctx.params;
  if (!id.trim()) return invalidId();

  const ok = await deleteDirectoryUser(id);
  if (!ok) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
