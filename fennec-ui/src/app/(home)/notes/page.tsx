import styles from "./styles.module.css";

export default function NotesPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <h1>This is from Fennec NOTEEEEES Page component</h1>
      <div>{children}</div>
    </div>
  );
}
