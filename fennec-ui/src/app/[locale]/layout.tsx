import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/context/theme-context";
import { cookies } from "next/headers";
import { THEME, type Theme } from "@/types/theme.type";
import { LoaderProvider } from "@/context/loader.context";

export const metadata: Metadata = {
  title: "Andrés Ramírez | Tech Notes",
  description: "Personal Notes.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) ?? THEME.dark;

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={theme === THEME.dark ? THEME.dark : THEME.light}
    >
      <body>
        <LoaderProvider>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
