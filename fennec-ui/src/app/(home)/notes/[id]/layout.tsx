import { getCategoryNotesMeta } from "@/services/noteService";
import styles from "./styles.module.css";
import Link from "next/link";

interface NotesLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
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
        <Link href={"/"}>Go home</Link>
        <h3>On this category</h3>
        <ul>
          {notesMeta.map(({ id: noteId, title }) => (
            <li key={noteId} className={styles.noteLink}>
              <Link href={`/notes/${id}/${noteId}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
