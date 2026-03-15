"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const NAMES: Record<string, string> = {};

function ReportContent() {
  const searchParams = useSearchParams();
  const user = searchParams ? searchParams.get("user") : null;
  const uid = user ?? "";
  const name = uid && NAMES[uid] ? NAMES[uid] : "This user";
  const [sent, setSent] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Report incomplete swap</h1>
            </div>
            <p className="mt-2 text-deep-600 dark:text-deep-400">
              {name} did not deliver the skills you agreed on. We will follow up with them.
            </p>
            {!sent ? (
              <div className="mt-6">
                <button type="button" onClick={() => setSent(true)} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white hover:bg-amber-600">
                  <Mail className="h-4 w-4" /> Submit report
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <p className="font-medium text-green-800 dark:text-green-200">We have received your report and will follow up.</p>
              </div>
            )}
            <div className="mt-6">
              <Link href={uid ? "/profile/" + uid : "/browse"} className="text-sm font-medium text-deep-600 hover:text-brand-500 dark:text-deep-400">Back to profile or Browse</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
