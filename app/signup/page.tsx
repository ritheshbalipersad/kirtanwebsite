"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useUser } from "@/app/context/UserContext";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const adminEmail = "kirtan.balipersad@gmail.com";
  const isAdminEmail = email.trim().toLowerCase() === adminEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const username = (email.split("@")[0] || "user").replace(/[^a-z0-9]/gi, "") || "user";
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, name, surname, birthDate: birthDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      await refresh();
      router.push("/");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-sm px-4 py-12">
          <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Create account</h1>
          <p className="mt-2 text-deep-600 dark:text-deep-400">Sign up with email, password, birth date and profile details.</p>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="hidden mt-4 w-full rounded-lg border border-deep-300 bg-white px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-50 dark:border-deep-600 dark:bg-deep-900 dark:text-deep-200"
          >
            Sign up with Google
          </button>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <div className="rounded-lg border border-deep-200 bg-deep-50/50 p-3 dark:border-deep-700 dark:bg-deep-800/50">
              <p className="mb-2 text-sm font-medium text-deep-700 dark:text-deep-300">Name</p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  placeholder="First name"
                />
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required={!isAdminEmail}
                  className="w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  placeholder={isAdminEmail ? "Surname (optional)" : "Surname"}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-4 pr-20 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-deep-600 hover:bg-deep-100 dark:text-deep-400 dark:hover:bg-deep-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Birth date</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-6">
            <Link href="/login" className="text-brand-500 hover:underline">Already have an account? Log in</Link>
            <span className="mx-2 text-deep-400">|</span>
            <Link href="/" className="text-deep-500 hover:underline">Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
