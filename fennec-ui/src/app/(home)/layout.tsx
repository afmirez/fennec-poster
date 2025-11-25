"use client";

import styles from "./styles.module.css";
import { useTheme } from "@/context/theme-context";
import { THEME } from "@/types/theme.type";
import { useLoader } from "@/context/loader.context";
import Loader from "@/components/Loader/Loader";

import { ICON_KEYS } from "@/types/icon-keys.type";
import IconButton from "@/components/IconButton/IconButton";
import Image from "next/image";

import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  const { isLoading } = useLoader();

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className={styles.layout}>
          <div className={styles.layoutInner}>
            <header className={styles.header}>
              <Image
                src="/afmirez-logo.png"
                alt="Andres Ramirez Logo"
                height={70}
                width={70}
                unoptimized
              />
              <ul className={styles.headerMenu}>
                <li>
                  <IconButton
                    iconKey={
                      theme.theme === THEME.dark
                        ? ICON_KEYS.moon
                        : ICON_KEYS.sun
                    }
                    onClick={theme.toggleTheme}
                  />
                </li>
              </ul>
            </header>
            <main className={styles.content}>{children}</main>
            <footer className={styles.footer}>
              <div>
                <span>
                  Authored by <Link href="https://www.afmirez.dev/">me</Link>.
                  Data is open — clone it, break it, or improve it. The code is
                  a bit messy, but it works… mostly.
                </span>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
