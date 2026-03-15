"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginAdmin, logoutAdmin } = useAuth();
  const { refresh } = useUser();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password, birthDate: birthDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (data.user && data.isAdmin) {
        loginAdmin(data.user.email);
      } else {
        logoutAdmin();
      }
      await refresh();
      if (data.user && data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xs rounded-xl border border-deep-200 bg-white p-4 shadow-sm dark:border-deep-700 dark:bg-deep-900">
          <h1 className="font-display text-xl font-bold text-deep-900 dark:text-white">Log in</h1>
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Email/username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                autoComplete="username"
                className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-3 py-2 text-sm text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                placeholder="Email or username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Password</label>
              <div className="relative mt-0.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-deep-200 bg-white py-2 pl-3 pr-14 text-sm text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-deep-600 hover:text-deep-800 dark:text-deep-400 dark:hover:text-deep-200"
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
                className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-3 py-2 text-sm text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>
          <p className="mt-3 text-sm">
            <Link href="/signup" className="text-brand-500 hover:underline">Create account</Link>
            <span className="mx-1.5 text-deep-400">·</span>
            <Link href="/" className="text-deep-500 hover:underline">Home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
