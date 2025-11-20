import Image from "next/image";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

const Loader = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.nameContainer}>
        <h1>Tech</h1>
        <Image
          className={styles.logo}
          src="/afmirez-logo.png"
          alt="Andres Ramirez logo"
          height={150}
          width={150}
          unoptimized
        />
        <h1>Notes</h1>
      </div>
      <small className={styles.roleCommand}>{"by Andrés Ramírez"}</small>
    </div>
  );
};

export default Loader;
