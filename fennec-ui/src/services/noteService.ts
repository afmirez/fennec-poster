import { NoteDeletionRequest, NoteRecord } from "@/interfaces/notePayload";
import {
  createNote,
  noteExistsById,
  updateNote,
  deleteNoteById,
} from "@/repositories/noteRepo";

import { Note } from "@/types/db";
import { handleTags } from "./tagService";
import {
  createNewCategory,
  getNewAndExistingCategories,
  removeEmptyCategories,
} from "./categoryService";
import { CategoryMaping } from "@/interfaces/categoryMaping";

export async function handleUpsertNotes(notes: NoteRecord[]) {
  /* 
    Step 1 – Group notes by existing or new categories.
  */

  let newCategoryMap: Record<string, CategoryMaping> = {};
  let existingCategoryMap: Record<string, CategoryMaping> = {};
  try {
    ({
      newCategories: newCategoryMap,
      existingCategories: existingCategoryMap,
    } = await getNewAndExistingCategories(notes));
  } catch (error) {
    console.log("Error getting new and existing categories: ", error);
    return;
  }

  /*
    Step 2 - Create new categories and get its id.
  */
  if (Object.keys(newCategoryMap).length > 0) {
    for (const categoryName of Object.keys(newCategoryMap)) {
      try {
        const categoryId = await createNewCategory(categoryName);
        newCategoryMap[categoryName].categoryId = categoryId;
      } catch (error) {
        console.log("Error creating new categories: ", error);
        return;
      }
    }
  }

  /* 
    Step 3 – All notes in new categories are new, so create them directly.
  */
  if (Object.keys(newCategoryMap).length > 0) {
    for (const categoryMapping of Object.values(newCategoryMap)) {
      try {
        await createNotes(categoryMapping);
      } catch (error) {
        console.log("Error creating notes for new categories: ", error);
        return;
      }
    }
  }

  /*
    Step 4 - For existing categories, update notes if they exist; otherwise, create them.
  */
  if (Object.keys(existingCategoryMap).length > 0) {
    for (const categoryMapping of Object.values(existingCategoryMap)) {
      let newNotes: CategoryMaping = { noteRecords: [] };
      let existingNotes: CategoryMaping = { noteRecords: [] };

      try {
        ({ newNotes: newNotes, existingNotes: existingNotes } =
          await getNewAndExistingNotesPerCategory(categoryMapping));
      } catch (error) {
        console.log(
          "Error getting new and existing notes for existing category : ",
          error
        );
        return;
      }

      if (newNotes.noteRecords.length > 0) {
        try {
          await createNotes(newNotes);
        } catch (error) {
          console.log("Error creating notes for exiting category: ", error);
        }
      }

      if (existingNotes.noteRecords.length > 0) {
        try {
          await updateNotes(existingNotes);
        } catch (error) {
          console.log("Error updating notes for exiting category: ", error);
        }
      }
    }
  }
}

async function getNewAndExistingNotesPerCategory(
  categoryMapping: CategoryMaping
) {
  const notesToCreate: CategoryMaping = {
    noteRecords: [],
    categoryId: categoryMapping.categoryId,
  };

  const notesToUpdate: CategoryMaping = {
    noteRecords: [],
    categoryId: categoryMapping.categoryId,
  };

  for (const noteRecord of categoryMapping.noteRecords) {
    const noteAlreadyExists = await noteExistsById(noteRecord.frontmatter.id);

    if (noteAlreadyExists) {
      notesToUpdate.noteRecords.push(noteRecord);
    } else {
      notesToCreate.noteRecords.push(noteRecord);
    }
  }

  return { newNotes: notesToCreate, existingNotes: notesToUpdate };
}

async function createNotes(categoryMap: CategoryMaping) {
  const categoryId: string = categoryMap!.categoryId!;
  const notes: NoteRecord[] = categoryMap.noteRecords;

  for (const n of notes) {
    const note: Note = {
      category_id: categoryId,
      description: n.frontmatter.description,
      id: n.frontmatter.id,
      sort_order: n.frontmatter.order,
      title: n.frontmatter.title,
      html: n.html,
    };

    await createNote(note);
    await handleTags(n);
  }
}

async function updateNotes(categoryMap: CategoryMaping) {
  const notes: NoteRecord[] = categoryMap.noteRecords;

  for (const n of notes) {
    const updatedNote: Partial<Note> = {
      description: n.frontmatter.description,
      sort_order: n.frontmatter.order,
      title: n.frontmatter.title,
      html: n.html,
    };

    await updateNote(n.frontmatter.id, updatedNote);
    await handleTags(n);
  }
}

export async function handleDeleteNotes(notesToRemove: NoteDeletionRequest[]) {
  const categories: string[] = [];

  for (const n of notesToRemove) {
    categories.push(n.category);
    try {
      await deleteNoteById(n.note_id);
    } catch (error) {
      console.log("Error removing note: ", error);
    }
  }

  console.log("error here");

  await removeEmptyCategories(categories);
}
