"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { usePreferences, CURRENCIES, LANGUAGES, type CurrencyCode, type LanguageCode } from "../context/PreferencesContext";
import { useUser } from "../context/UserContext";
import { Settings, User, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

const BOT_QUIZ: { question: string; answers: string[]; image?: React.ReactNode }[] = [
  {
    question: "How many cats are in the picture below?",
    answers: ["4", "four"],
    image: (
      <svg viewBox="0 0 200 100" className="mx-auto w-full max-w-xs rounded-lg border border-deep-200 bg-deep-50 dark:border-deep-700 dark:bg-deep-800/50" aria-hidden>
        {/* 4 simple cat silhouettes */}
        <ellipse cx="35" cy="65" rx="22" ry="18" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="20,50 35,35 50,50" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="35,35 50,50 65,35" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <circle cx="28" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <circle cx="42" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <ellipse cx="85" cy="65" rx="22" ry="18" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="70,50 85,35 100,50" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="85,35 100,50 115,35" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <circle cx="78" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <circle cx="92" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <ellipse cx="135" cy="65" rx="22" ry="18" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="120,50 135,35 150,50" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="135,35 150,50 165,35" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <circle cx="128" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <circle cx="142" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <ellipse cx="165" cy="65" rx="22" ry="18" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="150,50 165,35 180,50" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <polygon points="165,35 180,50 195,35" fill="currentColor" className="text-deep-600 dark:text-deep-400" />
        <circle cx="158" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
        <circle cx="172" cy="62" r="3" fill="white" className="fill-white dark:fill-deep-200" />
      </svg>
    ),
  },
  { question: "How many days are in a week?", answers: ["7", "seven"] },
  { question: "What is the first letter of the word 'apple'?", answers: ["a"] },
  { question: "What color is grass usually?", answers: ["green"] },
];

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase();
}

function isQuizAnswerCorrect(questionIndex: number, answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  return BOT_QUIZ[questionIndex].answers.some((a) => normalizeAnswer(a) === normalized);
}

const DEVICE_ANSWERS = [
  "phone", "mobile", "smartphone", "cell", "cellphone", "iphone", "android",
  "computer", "laptop", "pc", "desktop", "notebook", "mac", "macbook", "windows",
  "tablet", "ipad", "chromebook",
];
function isDeviceAnswerValid(answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  if (normalized.length < 2) return false;
  return DEVICE_ANSWERS.some((d) => normalized === d || normalized.includes(d));
}

export default function SettingsPage() {
  const { currency, language, setCurrency, setLanguage } = usePreferences();
  const { user, refresh } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizError, setQuizError] = useState("");
  const [notABotChecked, setNotABotChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const openAccount = () => {
    setAccountOpen(true);
    setQuizStep(1);
    setQuizAnswer("");
    setQuizError("");
    setNotABotChecked(false);
    setTermsChecked(false);
    setName(user?.name ?? "");
    setSurname(user?.surname ?? "");
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
    setBirthDate(user?.birthDate ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setAccountError("");
    setAccountSuccess(false);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizError("");
    // Step 1: I am not a bot checkbox
    if (quizStep === 1) {
      if (!notABotChecked) {
        setQuizError("Please confirm you are not a bot.");
        return;
      }
      setQuizStep(2);
      return;
    }
    // Step 5: terms of service checkbox (last step – then show account form)
    if (quizStep === 5) {
      if (!termsChecked) {
        setQuizError("Please agree to our terms of service to continue.");
        return;
      }
      setQuizStep(7);
      setQuizAnswer("");
      return;
    }
    // Steps 2, 3, 4: text questions (step 3 = username, step 4 = device)
    const answer = quizAnswer.trim();
    if (!answer) {
      setQuizError("Please enter an answer.");
      return;
    }
    if (quizStep === 3) {
      if (normalizeAnswer(answer) !== normalizeAnswer(user?.username ?? "")) {
        setQuizError("That's not the username we have on file. Try again.");
        return;
      }
    } else if (quizStep === 4) {
      if (!isDeviceAnswerValid(answer)) {
        setQuizError("Please enter the device you're using (e.g. phone, laptop, tablet).");
        return;
      }
    } else {
      if (!isQuizAnswerCorrect(0, answer)) {
        setQuizError("That's not right. Try again.");
        return;
      }
    }
    setQuizStep(quizStep + 1);
    setQuizAnswer("");
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError("");
    setAccountSuccess(false);
    if (!currentPassword.trim()) {
      setAccountError("Enter your current password to verify.");
      return;
    }
    if (newPassword && newPassword !== newPasswordConfirm) {
      setAccountError("New password and confirmation do not match.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setAccountError("New password must be at least 6 characters.");
      return;
    }
    setAccountLoading(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          name: name.trim(),
          surname: surname.trim(),
          username: username.trim(),
          email: email.trim(),
          birthDate: birthDate || null,
          ...(newPassword ? { newPassword } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAccountError(data.error ?? "Update failed");
        return;
      }
      setAccountSuccess(true);
      await refresh();
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      setAccountError("Something went wrong. Please try again.");
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="flex items-center gap-3 text-deep-900 dark:text-white">
            <Settings className="h-8 w-8 text-brand-500" />
            <h1 className="font-display text-2xl font-bold">Settings</h1>
          </div>
          <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">
            Choose your currency and language. Manage your account details below.
          </p>

          {/* Account info */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => (accountOpen ? setAccountOpen(false) : user ? openAccount() : null)}
              className="flex w-full items-center justify-between rounded-xl border border-deep-200 bg-white px-4 py-3 text-left transition hover:bg-deep-50 dark:border-deep-700 dark:bg-deep-900/50 dark:hover:bg-deep-800/50"
            >
              <span className="flex items-center gap-2 font-medium text-deep-900 dark:text-white">
                <User className="h-5 w-5 text-brand-500" />
                Account info
              </span>
              {user ? (accountOpen ? <ChevronUp className="h-5 w-5 text-deep-500" /> : <ChevronDown className="h-5 w-5 text-deep-500" />) : null}
            </button>
            {!user && (
              <p className="mt-2 text-sm text-deep-500 dark:text-deep-400">
                <Link href="/login" className="font-medium text-brand-500 hover:underline">Sign in</Link> to change your password, name, email, and more.
              </p>
            )}
            {user && accountOpen && quizStep < 7 && (
              <div className="mt-3 rounded-xl border border-deep-200 bg-white p-4 dark:border-deep-700 dark:bg-deep-900/50">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-deep-700 dark:text-deep-300">
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                  Verify you&apos;re human
                </div>
                <p className="mb-3 text-xs text-deep-500 dark:text-deep-400">Step {quizStep} of 5</p>
                <form onSubmit={handleQuizSubmit}>
                  {quizStep === 1 ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="not-a-bot"
                        checked={notABotChecked}
                        onChange={(e) => setNotABotChecked(e.target.checked)}
                        className="h-4 w-4 rounded border-deep-300 text-brand-500 focus:ring-brand-500"
                      />
                      <label htmlFor="not-a-bot" className="cursor-pointer text-sm font-medium text-deep-700 dark:text-deep-300">
                        I am not a bot
                      </label>
                    </div>
                  ) : quizStep === 3 ? (
                    <>
                      <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">
                        What username did you use when you signed up?
                      </label>
                      <input
                        type="text"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="Your sign-up username"
                        autoComplete="username"
                        className="mt-2 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </>
                  ) : quizStep === 4 ? (
                    <>
                      <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">
                        What device are you using to log in?
                      </label>
                      <input
                        type="text"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="e.g. phone, laptop, tablet"
                        autoComplete="off"
                        className="mt-2 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </>
                  ) : quizStep === 5 ? (
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms-agree"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-deep-300 text-brand-500 focus:ring-brand-500"
                      />
                      <label htmlFor="terms-agree" className="cursor-pointer text-sm font-medium text-deep-700 dark:text-deep-300">
                        I agree to our{" "}
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-500 underline hover:text-brand-600">
                          terms of service
                        </Link>
                      </label>
                    </div>
                  ) : (
                    <>
                      {BOT_QUIZ[0].image && <div className="mb-3">{BOT_QUIZ[0].image}</div>}
                      <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">
                        {BOT_QUIZ[0].question}
                      </label>
                      <input
                        type="text"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="Your answer"
                        autoComplete="off"
                        className="mt-2 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </>
                  )}
                  {quizError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{quizError}</p>}
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600"
                  >
                    {quizStep === 5 ? "Finish" : "Next"}
                  </button>
                </form>
              </div>
            )}
            {user && accountOpen && quizStep === 7 && (
              <form onSubmit={handleAccountSubmit} className="mt-3 rounded-xl border border-deep-200 bg-white p-4 dark:border-deep-700 dark:bg-deep-900/50">
                <p className="mb-4 text-sm text-deep-600 dark:text-deep-400">
                  Enter your current password to verify your identity, then update any fields you want to change.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Current password (required)</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Surname</label>
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Birth date</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">New password (optional)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  {newPassword && (
                    <div>
                      <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Confirm new password</label>
                      <input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="Confirm new password"
                        className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
                {accountError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{accountError}</p>}
                {accountSuccess && <p className="mt-3 text-sm text-green-600 dark:text-green-400">Account updated successfully.</p>}
                <button
                  type="submit"
                  disabled={accountLoading}
                  className="mt-4 w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {accountLoading ? "Saving…" : "Save changes"}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-deep-700 dark:text-deep-300">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-2 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-deep-700 dark:text-deep-300">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="mt-2 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-deep-500 dark:text-deep-400">
                App language preference. Full translations may be added later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
