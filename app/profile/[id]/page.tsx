"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Video, Award, MessageCircle, DollarSign, RefreshCw, AlertTriangle, UserPlus } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PremiumExpertBadge } from "../../components/PremiumExpertBadge";
import { useAuth } from "@/app/context/AuthContext";
import { usePreferences } from "@/app/context/PreferencesContext";

type ProfileData = { name: string; tagline: string; rating: number; reviews: number; offers: string[]; wants: string[]; level: string; bio: string; paidPrice: number | null; premiumMonths: number; trustedCount: number; sessionsCount: number };

function hasRedBadge(hasPremium: boolean, trusted: number, sessionsCount: number) {
  return hasPremium && trusted >= 20 && sessionsCount >= 50;
}

export default function ProfilePage() {
  const params = useParams();
  const { isAdmin } = useAuth();
  const { formatPrice } = usePreferences();
  const id = params?.id as string;
  const [p, setP] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetch(`/api/services/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.service) setP(data.service);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="text-deep-500 dark:text-deep-400">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!p || notFound) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="text-deep-600 dark:text-deep-400">Profile not found.</p>
          <Link href="/browse" className="mt-4 inline-block text-brand-500 hover:underline">Back to browse</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">{p.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">{p.name}</h1>
                    {hasRedBadge(p.premiumMonths >= 1, p.trustedCount, p.sessionsCount) && <PremiumExpertBadge size="lg" />}
                  </div>
                  <p className="text-deep-600 dark:text-deep-400">{p.tagline}</p>
                  {(p.rating > 0 || p.reviews > 0) && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{p.rating}</span>
                      <span className="text-deep-500">({p.reviews} reviews)</span>
                    </div>
                  )}
                  <span className="mt-2 inline-block rounded-full bg-deep-100 px-2.5 py-0.5 text-xs font-medium text-deep-600 dark:bg-deep-700 dark:text-deep-300">{p.level}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/session/book?user=${id}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600"><Video className="h-4 w-4" /> Book session</Link>
                {isAdmin && (
                  <Link href={`/message/${id}`} className="inline-flex items-center gap-2 rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800"><MessageCircle className="h-4 w-4" /> Chat privately (admin)</Link>
                )}
                <Link href={`/groups/add/${id}`} className="inline-flex items-center gap-2 rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800"><UserPlus className="h-4 w-4" /> Add to group</Link>
              </div>
            </div>
            <p className="mt-4 text-sm text-deep-500 dark:text-deep-400">
              They didn&apos;t complete the swap? <Link href={`/session/report?user=${id}`} className="inline-flex items-center gap-1 font-medium text-amber-600 hover:underline dark:text-amber-400"><AlertTriangle className="h-3.5 w-3.5" /> Report</Link>
            </p>
            {p.bio && <p className="mt-6 text-deep-700 dark:text-deep-300">{p.bio}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-100 px-3 py-1.5 text-sm font-medium text-deep-700 dark:bg-deep-600 dark:text-deep-200"><RefreshCw className="h-4 w-4" /> Free skill swap</span>
              {p.paidPrice != null && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800 dark:bg-brand-900/50 dark:text-brand-200"><DollarSign className="h-4 w-4" /> Paid — {formatPrice(p.paidPrice)}/session</span>}
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 font-semibold text-deep-900 dark:text-white"><Award className="h-4 w-4 text-brand-500" /> Skills I offer</h2>
                <ul className="mt-2 flex flex-wrap gap-2">{p.offers.map((s) => <li key={s} className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">{s}</li>)}</ul>
              </div>
              <div>
                <h2 className="font-semibold text-deep-900 dark:text-white">Skills I want to learn</h2>
                <ul className="mt-2 flex flex-wrap gap-2">{p.wants.map((s) => <li key={s} className="rounded-full bg-deep-100 px-3 py-1 text-sm font-medium text-deep-700 dark:bg-deep-700 dark:text-deep-300">{s}</li>)}</ul>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center"><Link href="/browse" className="text-sm text-deep-500 hover:text-brand-500">← Back to browse</Link></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
