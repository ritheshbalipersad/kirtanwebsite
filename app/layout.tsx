import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PreferencesProvider } from "./context/PreferencesContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SkillSwap Pro — Exchange Skills, Not Money",
  description: "List skills you offer and skills you want. Get matched. Book video sessions.",
  openGraph: {
    url: siteUrl,
    siteName: "SkillSwap Pro",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-deep-900 antialiased dark:bg-deep-950 dark:text-deep-50" style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
        <AuthProvider>
          <UserProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
