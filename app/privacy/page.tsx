import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="font-display text-3xl font-bold text-deep-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-4 text-deep-600 dark:text-deep-400">How we handle your data. (Placeholder)</p>
          <p className="mt-6"><Link href="/" className="text-brand-500 hover:underline">Back to home</Link></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
