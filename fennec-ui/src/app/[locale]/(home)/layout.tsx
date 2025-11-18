import styles from "./styles.module.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.layoutInner}>
        <header className={styles.header}></header>
        <main className={styles.content}>{children}</main>
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
