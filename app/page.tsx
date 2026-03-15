"use client";

import Link from "next/link";
import {
  ArrowRight, Video, Star, Shield, Sparkles, BookOpen, Building2, Check, Zap, BadgeCheck, FolderOpen, Award, Users, RefreshCw, DollarSign, Mail,
} from "lucide-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useUser } from "./context/UserContext";
import { usePreferences } from "./context/PreferencesContext";

export default function HomePage() {
  const { user } = useUser();
  const { formatPrice } = usePreferences();

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-deep-200 bg-gradient-to-b from-brand-50/50 to-white dark:border-deep-800 dark:from-deep-900/50 dark:to-deep-950">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-800 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-200">
                <Sparkles className="h-4 w-4" /> Skills for skills, or skills for money
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-deep-900 dark:text-white md:text-5xl lg:text-6xl">
                Teach what you know.<br /><span className="text-brand-600 dark:text-brand-400">Learn what you need.</span>
              </h1>
              <p className="mt-6 text-lg text-deep-600 dark:text-deep-300">
                Trade skills for skills (free swap) or skills for money (paid sessions). Create a profile, get matched, and book video sessions.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href={user ? "/service/create" : "/signup"} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600">
                  {user ? "Start creating services" : "Create free profile"} <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/browse" className="inline-flex items-center gap-2 rounded-xl border-2 border-deep-300 bg-white px-6 py-3.5 text-base font-semibold text-deep-700 transition hover:border-deep-400 hover:bg-deep-50 dark:border-deep-600 dark:bg-deep-900 dark:text-deep-200 dark:hover:bg-deep-800">
                  Browse skills
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-deep-200 bg-white dark:border-deep-800 dark:bg-deep-950">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="font-display text-center text-3xl font-bold text-deep-900 dark:text-white md:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-deep-600 dark:text-deep-400">From profile to session in a few steps.</p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "1", icon: BookOpen, title: "Create profile", desc: "List skills you can offer and skills you want to learn." },
                { step: "2", icon: Zap, title: "Get matched", desc: "Trade skills for skills (free) or skills for money (paid). Swap with matched partners or book experts." },
                { step: "3", icon: Video, title: "Book sessions", desc: "Free skill-swap calls or paid expert sessions—all through our built-in video chat." },
                { step: "4", icon: Star, title: "Rate & level up", desc: "Rate each other after sessions. Build your skill levels and earn badges." },
                { step: "5", icon: Shield, title: "Stay accountable", desc: "If you don't deliver the skills you agreed to, we'll follow up with you." },
              ].map((item) => (
                <div key={item.step} className="relative rounded-2xl border border-deep-200 bg-deep-50/50 p-6 dark:border-deep-700 dark:bg-deep-900/30">
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">{item.step}</span>
                  <item.icon className="mt-2 h-10 w-10 text-brand-500" />
                  <h3 className="mt-4 font-semibold text-deep-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-deep-600 dark:text-deep-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 border-b border-deep-200 bg-deep-50/30 dark:border-deep-800 dark:bg-deep-900/20">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="font-display text-center text-3xl font-bold text-deep-900 dark:text-white md:text-4xl">Ways to exchange</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-deep-600 dark:text-deep-400">Skills for skills, or skills for money. Everyone stays accountable.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="flex gap-4 rounded-xl border border-deep-200 bg-white p-5 dark:border-deep-700 dark:bg-deep-900/50">
                <RefreshCw className="h-10 w-10 shrink-0 text-brand-500" />
                <div>
                  <h3 className="font-semibold text-deep-900 dark:text-white">Skills for skills</h3>
                  <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">Free swap: you teach them something, they teach you something. No money involved.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-deep-200 bg-white p-5 dark:border-deep-700 dark:bg-deep-900/50">
                <DollarSign className="h-10 w-10 shrink-0 text-brand-500" />
                <div>
                  <h3 className="font-semibold text-deep-900 dark:text-white">Skills for money</h3>
                  <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">Pay for expert sessions. Set your rate or book paid sessions (30% CEO share).</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
              <Mail className="h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-semibold text-deep-900 dark:text-white">Stay accountable</h3>
                <p className="mt-1 text-sm text-deep-700 dark:text-deep-300">If you don&apos;t give the other person the skills you agreed to in a swap, we&apos;ll follow up with you.</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-deep-600 dark:text-deep-400"><strong>No screenshots.</strong> Do not take screenshots of sessions or private chats.</p>
          </div>
        </section>

        <section id="premium" className="scroll-mt-20 border-b border-deep-200 bg-white dark:border-deep-800 dark:bg-deep-950">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="font-display text-center text-3xl font-bold text-deep-900 dark:text-white md:text-4xl">Premium features</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-deep-600 dark:text-deep-400">Unlock more with Pro.</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Sparkles, title: "AI skill-matching", desc: "Smarter matches based on your goals and availability." },
                { icon: BadgeCheck, title: "Verified Expert badge", desc: "Earn the red Verified Expert badge once you have Pro, are trusted by 20 people, and have completed 50 sessions." },
                { icon: FolderOpen, title: "Recorded session storage", desc: "Save and replay past sessions for review." },
                { icon: Award, title: "Certificates", desc: "Earn certificates after completing skill tracks." },
                { icon: Building2, title: "Business collaboration", desc: "Dedicated section for startups and teams." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-xl border border-deep-200 bg-white p-5 dark:border-deep-700 dark:bg-deep-900/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400"><item.icon className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-semibold text-deep-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-b border-deep-200 bg-deep-50/30 dark:border-deep-800 dark:bg-deep-900/20">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="font-display text-center text-3xl font-bold text-deep-900 dark:text-white md:text-4xl">Simple pricing</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-deep-600 dark:text-deep-400">Free to start. Upgrade when you need more.</p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/30">
                <h3 className="font-display text-lg font-semibold text-deep-900 dark:text-white">Free</h3>
                <p className="mt-1 text-3xl font-bold text-deep-900 dark:text-white">{formatPrice(0)}</p>
                <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">Forever free</p>
                <ul className="mt-6 space-y-3">
                  {["Profile & skill listing", "Basic matching", "Video chat sessions", "Ratings & reviews", "Skill levels"].map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm text-deep-700 dark:text-deep-300"><Check className="h-4 w-4 text-brand-500" /> {x}</li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-6 block w-full rounded-lg border-2 border-deep-300 py-2.5 text-center font-medium text-deep-700 transition hover:bg-deep-100 dark:border-deep-600 dark:text-deep-200">Get started</Link>
              </div>
              <div className="relative rounded-2xl border-2 border-brand-500 bg-brand-50/50 p-6 shadow-lg dark:bg-brand-950/20">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">Most popular</span>
                <h3 className="font-display text-lg font-semibold text-deep-900 dark:text-white">Pro</h3>
                <p className="mt-1 text-3xl font-bold text-deep-900 dark:text-white">{formatPrice(4.99)}</p>
                <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">Free 3 days, then per month</p>
                <ul className="mt-6 space-y-3">
                  {["Everything in Free", "AI skill-matching", "Verified expert badge", "Recorded session storage", "Certificates", "Business collaboration"].map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm text-deep-700 dark:text-deep-300"><Check className="h-4 w-4 text-brand-500" /> {x}</li>
                  ))}
                </ul>
                <Link href="/pro" className="mt-6 block w-full rounded-lg bg-brand-500 py-2.5 text-center font-medium text-white transition hover:bg-brand-600">Start Pro trial</Link>
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-deep-500 dark:text-deep-400">Paid expert sessions: 30% CEO share. Featured profile ads available.</p>
          </div>
        </section>

        <section className="border-b border-deep-200 bg-deep-900 dark:border-deep-800">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="flex flex-col items-center gap-6 text-center">
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Ready to swap skills?</h2>
              <p className="max-w-lg text-deep-300">Join thousands learning and teaching real skills. No subscription required to start.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={user ? "/service/create" : "/signup"} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-600">{user ? "Start creating services" : "Create free profile"} <ArrowRight className="h-5 w-5" /></Link>
                <Link href="/browse" className="inline-flex items-center gap-2 rounded-xl border border-deep-600 bg-transparent px-6 py-3.5 text-base font-semibold text-white transition hover:bg-deep-800"><Users className="h-5 w-5" /> Browse community</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
