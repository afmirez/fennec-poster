import Link from "next/link";
import styles from "./styles.module.css";
import { fetchCategories } from "@/services/categoryService";
import { Category } from "@/types/db";

export default async function HomePage() {
  const categories: Category[] = await fetchCategories();
  const mappedCategories = categories.map((cat) => ({
    ...cat,
    name: cat.name.split("-").join(" "),
  }));

  return (
    <div className={styles.homeContainer}>
      <div className={styles.introContainer}>
        <h1>
          Technical Notes by{" "}
          <Link href="https://www.afmirez.dev/">Andrés Ramírez</Link>
        </h1>
        <div className={styles.introDescription}>
          <p>
            These notes capture my ongoing learning-topics I explore, books I
            read, and ideas I experiment with. I usually draft my notes manually
            and then refine them through GPT to keep the structure clean and
            concise.
          </p>
          <p>
            The publishing flow is automated: I push the Markdown files to the{" "}
            <Link href="https://github.com/afmirez/fennec-poster">
              repository
            </Link>
            , and a mix of pre-commit hooks and a GitHub Action uploads them to
            the database in the required format.
          </p>
        </div>
      </div>
      <div className={styles.categoriesContainer}>
        {" "}
        <ul>
          {mappedCategories.map(({ id, name }) => (
            <li key={id} className={styles.noteLink}>
              <Link href={`/notes/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
