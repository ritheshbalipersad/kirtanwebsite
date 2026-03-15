"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAdmin) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      setError("Enter email and password.");
      return;
    }
    const allowed = ["kirtan.balipersad@gmail.com", "rithesh@hotmail.com"];
    if (!allowed.includes(trimmed)) {
      setError("Access denied. Only authorized admins can log in here.");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }
      loginAdmin(trimmed);
      router.push("/admin");
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-sm px-4 py-12">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50">
            <div className="flex items-center gap-3 text-brand-500">
              <Shield className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Admin login</h1>
            </div>
            <p className="mt-2 text-sm text-deep-600 dark:text-deep-400">Only authorized admin emails can access the dashboard.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="••••••••" />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button type="submit" className="w-full rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">Log in</button>
            </form>
            <p className="mt-4 text-center text-sm text-deep-500">
              <Link href="/" className="hover:text-brand-500">Back to home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
