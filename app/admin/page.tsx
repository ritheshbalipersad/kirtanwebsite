"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Users, BarChart3 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, mounted } = useAuth();

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, mounted, router]);

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-3 text-brand-500">
            <Shield className="h-8 w-8" />
            <h1 className="font-display text-3xl font-bold text-deep-900 dark:text-white">Admin dashboard</h1>
          </div>
          <p className="mt-2 text-deep-600 dark:text-deep-400">Manage the platform. Only visible when logged in as admin.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Link href="/admin/users" className="block rounded-xl border border-deep-200 bg-white p-6 transition hover:border-brand-300 dark:border-deep-700 dark:bg-deep-900/50 dark:hover:border-brand-700">
              <Users className="h-10 w-10 text-brand-500" />
              <h2 className="mt-3 font-semibold text-deep-900 dark:text-white">User accounts</h2>
              <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">View account settings and private chats (admin only).</p>
            </Link>
            <div className="rounded-xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50">
              <BarChart3 className="h-10 w-10 text-brand-500" />
              <h2 className="mt-3 font-semibold text-deep-900 dark:text-white">Reports</h2>
              <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">View reports and analytics.</p>
            </div>
          </div>
          <p className="mt-8">
            <Link href="/" className="text-sm text-deep-500 hover:text-brand-500">Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
