import { createClient } from "@/lib/supabase/server";
import { Note } from "@/types/db";

export async function noteExistsById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
}

export async function createNote(note: Note) {
  const supabase = await createClient();

  const { error } = await supabase.from("note").insert(note);

  if (error) throw new Error(error.message);
}

export async function updateNote(noteId: string, note: Partial<Note>) {
  const supabase = await createClient();

  const { error } = await supabase.from("note").update(note).eq("id", noteId);

  if (error) throw new Error(error.message);
}
