import { getCategoryNotesMeta } from "@/services/noteService";
import styles from "./styles.module.css";

interface NotesLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function NotesLayout({
  children,
  params,
}: NotesLayoutProps) {
  const { id } = await params;
  const notesMeta = await getCategoryNotesMeta(id);

  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <h3>On this category</h3>
        <ul>
          {notesMeta.map(({ id: noteId, title }) => (
            <li key={noteId} className={styles.noteLink}>
              {" "}
              {title}
            </li>
          ))}
        </ul>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
