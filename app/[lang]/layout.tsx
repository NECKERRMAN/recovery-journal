import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './components/theme-provider';
import NavBar from './components/NavBar';
import { getDictionary } from './dictionaries';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recovery Journal",
  description: "Keep track of your recovery with Recovery Journal",
};

export default async function RootLayout({
  params: { lang },
  children,
}: Readonly<{
  params: { lang: string };
  children: React.ReactNode;
}>) {
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar t={dict} lang={lang} />
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}
