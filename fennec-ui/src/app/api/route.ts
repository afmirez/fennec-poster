import { NoteRecord, NoteDeletionRequest } from "@/interfaces/notePayload";
import { NextResponse } from "next/server";
import { handleUpsertNotes, handleDeleteNotes } from "@/services/noteService";
import { verifyGithubOIDCToken } from "@/lib/auth/validator";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing bearer token" },
      { status: 401 }
    );
  }

  let payload;
  try {
    payload = await verifyGithubOIDCToken(auth);
  } catch (err: any) {
    const msg = String(err?.message || err);
    const status = /Incorrect branch/i.test(msg) ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }

  let notesRecords: NoteRecord[];
  try {
    notesRecords = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await handleUpsertNotes(notesRecords as NoteRecord[]);
    return NextResponse.json(
      { ok: true, actor: payload.actor },
      { status: 200 }
    );
  } catch (err) {
    console.error("handleUpsertNotes failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing bearer token" },
      { status: 401 }
    );
  }

  let payload;
  try {
    payload = await verifyGithubOIDCToken(auth);
  } catch (err: any) {
    const msg = String(err?.message || err);
    const status = /Incorrect branch/i.test(msg) ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }

  let notesToRemove: NoteDeletionRequest[];

  try {
    notesToRemove = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await handleDeleteNotes(notesToRemove);
    return NextResponse.json(
      { ok: true, actor: payload.actor },
      { status: 200 }
    );
  } catch (err) {
    console.error("handleDeleteNotes failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
