"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Video, Calendar, Clock, RefreshCw, DollarSign } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { usePreferences } from "../../context/PreferencesContext";

const MOCK_PAID_PRICE: Record<string, number> = {};
type Freq = "session" | "daily" | "weekly" | "monthly" | "yearly";
const FREQ_LABELS: Record<Freq, string> = { session: "Per session", daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };

function BookSessionContent() {
  const searchParams = useSearchParams();
  const { formatPrice, currencySymbol } = usePreferences();
  const userId = searchParams?.get("user") ?? "";
  const suggested = userId ? (MOCK_PAID_PRICE[userId] ?? 0) : 0;
  const hasPaid = suggested > 0;
  const [sessionType, setSessionType] = useState<"free" | "paid">(hasPaid ? "paid" : "free");
  const [amount, setAmount] = useState(suggested > 0 ? String(suggested) : "");
  const [frequency, setFrequency] = useState<Freq>("session");
  const amountNum = parseFloat(amount) || 0;
  const ceoShareRate = 0.3;
  const ceoShare = sessionType === "paid" && amountNum > 0 ? Math.round(amountNum * ceoShareRate * 100) / 100 : 0;
  const toExpert = sessionType === "paid" && amountNum > 0 ? Math.round(amountNum * (1 - ceoShareRate) * 100) / 100 : 0;
  const total = sessionType === "paid" ? amountNum : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <Video className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Book a session</h1>
            </div>
            <p className="mt-2 text-deep-600 dark:text-deep-400">
              Trade skills for skills (free swap) or skills for money (paid session). No screenshots during sessions or in chat.
            </p>
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-deep-700 dark:text-deep-300">Session type</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSessionType("free")} className={`flex flex-1 items-center gap-3 rounded-xl border-2 p-4 text-left transition ${sessionType === "free" ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-deep-200 dark:border-deep-700"}`}>
                  <RefreshCw className="h-6 w-6 text-brand-500" />
                  <div>
                    <p className="font-semibold text-deep-900 dark:text-white">Free skill swap</p>
                    <p className="text-sm text-deep-500">Exchange skills, no payment</p>
                  </div>
                </button>
                {hasPaid && (
                  <button type="button" onClick={() => setSessionType("paid")} className={`flex flex-1 items-center gap-3 rounded-xl border-2 p-4 text-left transition ${sessionType === "paid" ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-deep-200 dark:border-deep-700"}`}>
                    <DollarSign className="h-6 w-6 text-brand-500" />
                    <div>
                      <p className="font-semibold text-deep-900 dark:text-white">Pay the person</p>
                      <p className="text-sm text-deep-500">Choose amount & frequency</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
            {sessionType === "paid" && hasPaid && (
              <>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-deep-700 dark:text-deep-300">How much do you want to pay?</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-deep-600 dark:text-deep-400">{currencySymbol}</span>
                    <input type="number" min={0} step={0.01} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(suggested)} className="w-24 rounded-lg border border-deep-200 bg-white px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" />
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value as Freq)} className="rounded-lg border border-deep-200 bg-white px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white">
                      {(Object.entries(FREQ_LABELS) as [Freq, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-deep-200 bg-deep-50/50 p-4 dark:border-deep-700 dark:bg-deep-900/30">
                  <p className="text-sm font-medium text-deep-900 dark:text-white">Payment summary</p>
                  <div className="mt-2 space-y-1 text-sm text-deep-600 dark:text-deep-400">
                    <p className="flex justify-between">Session total <span>{formatPrice(amountNum > 0 ? amountNum : 0)}</span></p>
                    <p className="flex justify-between">To expert (70%) <span>{formatPrice(toExpert)}</span></p>
                    <p className="flex justify-between">CEO share (30%) <span>{formatPrice(ceoShare)}</span></p>
                    <p className="flex justify-between border-t border-deep-200 pt-2 font-semibold text-deep-900 dark:text-white">You pay <span>{formatPrice(total)}</span></p>
                  </div>
                </div>
              </>
            )}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                <Calendar className="h-5 w-5 text-deep-500" />
                <div>
                  <p className="font-medium text-deep-900 dark:text-white">Pick a date</p>
                  <p className="text-sm text-deep-500">Choose from available times</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                <Clock className="h-5 w-5 text-deep-500" />
                <div>
                  <p className="font-medium text-deep-900 dark:text-white">30–60 min sessions</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href={userId ? `/profile/${userId}` : "/browse"} className="rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">Back</Link>
              {sessionType === "paid" && amountNum > 0 ? (
                <Link href="/login" className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
                  Continue — Pay {formatPrice(total)} (sign in)
                </Link>
              ) : sessionType === "paid" ? (
                <button type="button" disabled className="rounded-lg bg-deep-300 px-4 py-2.5 font-medium text-deep-500 dark:bg-deep-600">Enter amount to continue</button>
              ) : (
                <Link href="/login" className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
                  Continue (sign in required)
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookSessionContent />
    </Suspense>
  );
}
