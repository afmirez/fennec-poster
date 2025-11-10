import { createClient } from "@/lib/supabase/server";

export async function upsertNoteTags(noteId: string, tagId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("note_tags")
    .upsert(
      { note_id: noteId, tag_id: tagId },
      { onConflict: "note_id, tag_id" }
    );

  if (error) throw new Error(error.message);
}

export async function getNoteTags(noteId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note_tags")
    .select("tag_id")
    .eq("note_id", noteId);

  if (error) throw new Error(error.message);

  return data;
}

export async function removeNoteTag(noteId: string, tagId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("note_tags")
    .delete()
    .eq("note_id", noteId)
    .eq("tag_id", tagId);

  if (error) throw new Error(error.message);
}
