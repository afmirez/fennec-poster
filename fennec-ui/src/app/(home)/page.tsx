import styles from "./styles.module.css";

export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <h1>This is from Fennec Home Page component</h1>
      <div>{children}</div>
    </div>
  );
}
