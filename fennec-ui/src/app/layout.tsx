import type { Metadata } from "next";
import "./globals.css";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) ?? THEME.dark;

  return (
    <html lang="en" className={theme === THEME.dark ? THEME.dark : THEME.light}>
      <body>
        <LoaderProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
