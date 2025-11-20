"use client";

import styles from "./styles.module.css";
import { useTheme } from "@/context/theme-context";
import { THEME } from "@/types/theme.type";
import { LANGUAGES, type LanguageKey } from "@/types/language.type";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLoader } from "@/context/loader.context";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import Dropdown from "@/components/Dropdown/Dropdown";
import { ICON_KEYS } from "@/types/icon-keys.type";
import IconButton from "@/components/IconButton/IconButton";
import Image from "next/image";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const { isLoading } = useLoader();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onLanguageChange = (val: string) => {
    const newLocale = val === LANGUAGES.en ? "en" : "es";
    router.replace(pathname, { locale: newLocale });
  };

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
                  {mounted && (
                    <Dropdown
                      icon={ICON_KEYS.globe}
                      options={Object.values(LANGUAGES)}
                      defaultOption={LANGUAGES[locale as LanguageKey]}
                      onChange={(val) => onLanguageChange(val)}
                    />
                  )}
                </li>
                <li>
                  {mounted && (
                    <IconButton
                      iconKey={
                        theme.theme === THEME.dark
                          ? ICON_KEYS.moon
                          : ICON_KEYS.sun
                      }
                      onClick={theme.toggleTheme}
                    />
                  )}
                </li>
              </ul>
            </header>
            <main className={styles.content}>{children}</main>
            <footer className={styles.footer}></footer>
          </div>
        </div>
      )}
    </>
  );
}
