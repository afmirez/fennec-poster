import { createClient } from "@/lib/supabase/server";

export async function createCategory(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("category")
    .insert({ name: name })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data.id;
}

export async function getCategoryIdByName(
  name: string
): Promise<string | undefined> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("category")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data?.id;
}

export async function deleteCategoryByName(categoryName: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("category")
    .delete()
    .eq("name", categoryName);

  if (error) throw new Error(error.message);
}

export async function categoryHasNotes(categoryName: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("note")
    .select("*", { count: "exact", head: true })
    .eq("name", categoryName);

  if (error) throw new Error(error.message);

  return (count ?? 0) > 0;
}
