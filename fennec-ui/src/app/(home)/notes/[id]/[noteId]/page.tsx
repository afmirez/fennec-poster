import { getEntireNoteById } from "@/services/noteService";
import styles from "./styles.module.css";

interface NotePageProps {
  params: { id: string; noteId: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const { noteId } = await params;

  const note = await getEntireNoteById(noteId);

  return (
    <article>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: note.html }}
      />
    </article>
  );
}
