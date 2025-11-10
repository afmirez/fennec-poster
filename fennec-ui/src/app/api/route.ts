import { NoteRecord } from "@/interfaces/notePayload";
import { NextResponse } from "next/server";
import { handleUpsertNotes } from "@/services/noteService";
import { removeCategoriesByName } from "@/services/categoryService";
import { CategoryDeletionRequest } from "@/interfaces/categoryPayload";

export async function POST(request: Request) {
  const notesRecords: NoteRecord[] = await request.json();

  await handleUpsertNotes(notesRecords);

  return NextResponse.json({
    message: "Just a test",
  });
}

export async function DELETE(request: Request) {
  const categoriesToRemove: CategoryDeletionRequest = await request.json();

  await removeCategoriesByName(categoriesToRemove.categories);

  return NextResponse.json({
    message: "Just a remove test",
  });
}

// 1. Detect deleted files from gha : construct small script and print appropiate payload : DONE
// 2. Publish project in vercel :
// 3. Setup auth de gha - endpoint
