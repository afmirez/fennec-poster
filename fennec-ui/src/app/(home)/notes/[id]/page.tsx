import styles from "./styles.module.css";
import { FC } from "react";

interface PostPageProps {
  params: {
    id: string;
  };
}

const PostPage: FC<PostPageProps> = async ({ params }) => {
  const { id } = params;

  return (
    <div className={styles.container}>
      <h1>This is from Fennec NOTEEEEES Page component</h1>
    </div>
  );
};

export default PostPage;
