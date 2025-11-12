import { CategoryMaping } from "@/interfaces/categoryMaping";
import { NoteRecord } from "@/interfaces/notePayload";
import {
  createCategory,
  deleteCategoryByName,
  getCategoryIdByName,
  categoryHasNotes,
} from "@/repositories/categoryRepo";

export async function createNewCategory(categoryName: string) {
  return await createCategory(categoryName);
}

export async function getNewAndExistingCategories(notes: NoteRecord[]) {
  const categoriesToCreate: Record<string, CategoryMaping> = {};
  const categoriesToUpdate: Record<string, CategoryMaping> = {};

  for (const noteRecord of notes) {
    const categoryName = noteRecord.frontmatter.category;
    const existingCategoryId = await getCategoryIdByName(categoryName);

    if (existingCategoryId) {
      if (!Object.hasOwn(categoriesToUpdate, categoryName)) {
        categoriesToUpdate[categoryName] = { noteRecords: [] };
      }

      categoriesToUpdate[categoryName].noteRecords.push(noteRecord);
      categoriesToUpdate[categoryName].categoryId = existingCategoryId;
    } else {
      if (!Object.hasOwn(categoriesToCreate, categoryName)) {
        categoriesToCreate[categoryName] = { noteRecords: [] };
      }

      categoriesToCreate[categoryName].noteRecords.push(noteRecord);
    }
  }

  return {
    newCategories: categoriesToCreate,
    existingCategories: categoriesToUpdate,
  };
}

export async function removeEmptyCategories(categories: string[]) {
  const unique = [...new Set(categories.filter(Boolean))];
  const toRemove: string[] = [];

  for (const c of unique) {
    const hasNotes = await categoryHasNotes(c);
    if (!hasNotes) {
      toRemove.push(c);
    }
  }

  for (const c of toRemove) {
    await deleteCategoryByName(c);
  }
}
