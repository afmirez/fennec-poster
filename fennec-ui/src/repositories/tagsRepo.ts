import { createClient } from "@/lib/supabase/server";

export async function getTagByName(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tag")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

export async function getTagById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tag")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

export async function createTag(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tag")
    .insert({ name: name })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data.id;
}
