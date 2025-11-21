import { createClient } from "@/lib/supabase/server";

export async function getAllCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

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

  const { data: category, error: catError } = await supabase
    .from("category")
    .select("id")
    .eq("name", categoryName)
    .single();

  if (catError) throw new Error(catError.message);
  if (!category) return false;

  const { count, error: noteError } = await supabase
    .from("note")
    .select("*", { count: "exact", head: true })
    .eq("category_id", category.id);

  if (noteError) throw new Error(noteError.message);

  return (count ?? 0) > 0;
}
