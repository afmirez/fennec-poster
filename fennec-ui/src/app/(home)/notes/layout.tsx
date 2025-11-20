import styles from "./styles.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}></aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
