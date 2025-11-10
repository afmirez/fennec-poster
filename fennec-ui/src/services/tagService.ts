import { NoteRecord } from "@/interfaces/notePayload";
import {
  getNoteTags,
  removeNoteTag,
  upsertNoteTags,
} from "@/repositories/noteTagsRepo";
import { createTag, getTagByName } from "@/repositories/tagsRepo";

export async function handleTags(note: NoteRecord) {
  const tagsToCreate: Record<string, string> = {};
  const existingTags: Record<string, string> = {};

  /* 
    Step 1 – Check if each tag already exists
  */
  for (const tagName of note.frontmatter.tags) {
    const tag = await getTagByName(tagName);

    if (tag) {
      if (!existingTags[tag.name]) {
        existingTags[tag.name] = tag.id;
      }
    } else {
      // tag doesn’t exist → mark for creation
      tagsToCreate[tagName] = "";
    }
  }

  /* 
    Step 2 – Create tags that don’t exist
  */
  if (Object.keys(tagsToCreate).length > 0) {
    for (const tagName of Object.keys(tagsToCreate)) {
      const createdTagId = await createTag(tagName);
      tagsToCreate[tagName] = createdTagId;
    }
  }

  /* 
    Step 4 – Remove obsolete tag associations
    (Delete note–tag relations that no longer appear in the note’s tags)
  */

  const validTagMap = Object.assign(existingTags, tagsToCreate);
  const currentTagLinks = await getNoteTags(note.frontmatter.id);

  if (currentTagLinks.length > 0) {
    for (const linkedTag of currentTagLinks) {
      const isStillUsed = Object.values(validTagMap).includes(linkedTag.tag_id);

      // If this tag is no longer referenced, remove the link
      if (!isStillUsed) {
        await removeNoteTag(note.frontmatter.id, linkedTag.tag_id);
      }
    }
  }

  /* 
    Step 5 – Link all tags (existing + new) to the note
  */
  for (const tagName of note.frontmatter.tags) {
    await upsertNoteTags(note.frontmatter.id, validTagMap[tagName]);
  }
}
