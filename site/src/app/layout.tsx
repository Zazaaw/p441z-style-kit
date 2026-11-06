import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/site/theme";
import { NotificationProvider } from "@/components/mac/notification";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "p441z Style Kit — quiet design, keynote motion",
  description:
    "A quiet, editorial design system for React + Tailwind: greyscale tokens, shadcn-style components, keynote-grade motion graphics, desktop-style windows, and 15 working skills for AI coding agents.",
  metadataBase: new URL("https://style.p441z.my.id"),
  openGraph: { title: "p441z Style Kit", description: "Quiet design. Keynote motion.", url: "https://style.p441z.my.id", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes writes the theme class before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
