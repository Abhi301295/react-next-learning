import { verifySessionCookie } from "@/lib/auth/firebase-session";
import { messages } from "@/lib/constants/messages";
import { userProfileFormSchema } from "@/lib/validation/user.schema";
import {
  deleteUserRecord,
  getUserRecordById,
  updateUserRecord,
  userRecordToResponseJson,
} from "@/lib/users/user-repository";
import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json(
    { message: messages.api.unauthorized },
    { status: 401 }
  );
}

type RouteContext = { params: Promise<{ id: string }> };

function invalidId() {
  return NextResponse.json(
    { message: messages.api.invalidUserId },
    { status: 400 }
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { id } = await ctx.params;
  if (!id.trim()) return invalidId();

  const row = await getUserRecordById(id);
  if (!row) {
    return NextResponse.json({ message: messages.api.notFound }, { status: 404 });
  }

  return NextResponse.json(userRecordToResponseJson(row.id, row.data), {
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
    return NextResponse.json(
      { message: messages.api.invalidJsonBody },
      { status: 400 }
    );
  }

  const parsed = userProfileFormSchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: messages.api.validationFailed,
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const updated = await updateUserRecord(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ message: messages.api.notFound }, { status: 404 });
  }

  return NextResponse.json(userRecordToResponseJson(updated.id, updated.data));
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const session = await verifySessionCookie();
  if (!session) return unauthorized();

  const { id } = await ctx.params;
  if (!id.trim()) return invalidId();

  const ok = await deleteUserRecord(id);
  if (!ok) {
    return NextResponse.json({ message: messages.api.notFound }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
