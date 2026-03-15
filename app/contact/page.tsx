"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type Topic = "Pricing" | "Scams or safety" | "General";
const TOPICS: Topic[] = ["Pricing", "Scams or safety", "General"];

export default function ContactPage() {
  const [topic, setTopic] = useState<Topic>("General");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <Mail className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Contact us</h1>
            </div>
            <p className="mt-2 text-deep-600 dark:text-deep-400">Choose a topic and we will get back to you.</p>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Topic</label>
                  <select value={topic} onChange={(e) => setTopic(e.target.value as Topic)} className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white">
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="Your message..." />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
                  <Send className="h-4 w-4" /> Send message
                </button>
              </form>
            ) : (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <p className="font-medium text-green-800 dark:text-green-200">Thanks. We have received your message and will get back to you.</p>
              </div>
            )}
            <p className="mt-6">
              <Link href="/" className="text-sm text-deep-500 hover:text-brand-500">Back to home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
