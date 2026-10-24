import { Manrope, Unbounded } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

export const metadata = {
  title: "Мох — ИИ-помощник для сбора заявок",
  description:
    "Студия «Мох» внедряет компаниям ИИ-помощников: они отвечают клиентам и мягко доводят диалог до заявки.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      data-theme="dark"
      className={`${manrope.variable} ${unbounded.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
