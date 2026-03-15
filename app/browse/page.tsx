"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, Video, Filter, DollarSign, RefreshCw, MapPin, UserPlus, Briefcase, Trash2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PremiumExpertBadge } from "../components/PremiumExpertBadge";
import { useUser } from "@/app/context/UserContext";
import { usePreferences } from "@/app/context/PreferencesContext";

type ServiceUser = { id: string; name: string; tagline: string; rating: number; reviews: number; offers: string[]; wants: string[]; level: string; paidPrice: number | null; premiumMonths: number; trustedCount: number; sessionsCount: number; location: string };

function hasPremiumExpertBadge(hasPremium: boolean, trustedCount: number, sessionsCount: number) {
  return hasPremium && trustedCount >= 20 && sessionsCount >= 50;
}

type FilterMode = "all" | "free" | "paid";

export default function BrowsePage() {
  const { user: currentUser } = useUser();
  const { formatPrice } = usePreferences();
  const [services, setServices] = useState<ServiceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState<FilterMode>("all");
  const [locationFilter, setLocationFilter] = useState("");

  const fetchServices = () => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchServices();
  }, []);

  const handleDeleteService = async (serviceUserId: string) => {
    if (!currentUser || currentUser.id !== serviceUserId) return;
    if (!confirm("Delete your service? You will no longer appear in Browse.")) return;
    setDeletingId(serviceUserId);
    try {
      const res = await fetch("/api/services", { method: "DELETE" });
      if (res.ok) fetchServices();
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = services.filter((u) => {
    const matchQuery = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.offers.some((s) => s.toLowerCase().includes(query.toLowerCase())) || u.wants.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchSkill = !skillFilter || u.offers.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase())) || u.wants.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchExchange = exchangeFilter === "all" || (exchangeFilter === "free" && !u.paidPrice) || (exchangeFilter === "paid" && u.paidPrice != null);
    const matchLocation = !locationFilter.trim() || (u.location || "").toLowerCase().includes(locationFilter.trim().toLowerCase());
    return matchQuery && matchSkill && matchExchange && matchLocation;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-display text-3xl font-bold text-deep-900 dark:text-white">Browse skill swappers</h1>
          <p className="mt-2 text-deep-600 dark:text-deep-400">Find someone who offers what you need and wants what you offer.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-400" />
              <input type="search" placeholder="Search by name or skill..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-10 pr-4 text-deep-900 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900" />
            </div>
            <div className="relative min-w-[200px] flex-1">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-400" />
              <input type="text" placeholder="Filter by skill..." value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-10 pr-4 text-deep-900 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900" />
            </div>
            <div className="relative min-w-[200px] flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-400" />
              <input type="text" placeholder="Type your location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-10 pr-4 text-deep-900 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-deep-500 dark:text-deep-400">Exchange:</span>
              {(["all", "free", "paid"] as const).map((mode) => (
                <button key={mode} type="button" onClick={() => setExchangeFilter(mode)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${exchangeFilter === mode ? "bg-brand-500 text-white" : "bg-deep-100 text-deep-600 hover:bg-deep-200 dark:bg-deep-700 dark:text-deep-300 dark:hover:bg-deep-600"}`}>
                  {mode === "all" ? "All" : mode === "free" ? "Free swap only" : "Paid sessions"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((user) => (
              <div key={user.id} className="rounded-xl border border-deep-200 bg-white p-5 shadow-sm dark:border-deep-700 dark:bg-deep-900/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">{user.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-deep-900 dark:text-white">{user.name}</span>
                        {hasPremiumExpertBadge(user.premiumMonths >= 1, user.trustedCount, user.sessionsCount) && <PremiumExpertBadge size="sm" />}
                      </div>
                      <p className="text-sm text-deep-500 dark:text-deep-400">{user.tagline}</p>
                      {user.location && <p className="mt-0.5 flex items-center gap-1 text-xs text-deep-500 dark:text-deep-400"><MapPin className="h-3 w-3" /> {user.location}</p>}
                    </div>
                  </div>
                  <span className="rounded-full bg-deep-100 px-2.5 py-0.5 text-xs font-medium text-deep-600 dark:bg-deep-700 dark:text-deep-300">{user.level}</span>
                </div>
                {(user.rating > 0 || user.reviews > 0) && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-deep-600 dark:text-deep-400">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{user.rating || "—"}</span>
                    <span>({user.reviews} reviews)</span>
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-deep-500 dark:text-deep-400">Offers</p>
                  <p className="mt-1 text-sm text-deep-700 dark:text-deep-300">{user.offers.join(" · ")}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-deep-500 dark:text-deep-400">Wants</p>
                  <p className="mt-1 text-sm text-deep-700 dark:text-deep-300">{user.wants.join(" · ")}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-100 px-2.5 py-1 text-xs font-medium text-deep-700 dark:bg-deep-600 dark:text-deep-200"><RefreshCw className="h-3.5 w-3.5" /> Free swap</span>
                  {user.paidPrice != null && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-800 dark:bg-brand-900/50 dark:text-brand-200"><DollarSign className="h-3.5 w-3.5" /> {formatPrice(user.paidPrice)}/session</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/profile/${user.id}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                    <Video className="h-4 w-4" /> Book session
                  </Link>
                  <Link href={`/groups/add/${user.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 rounded-lg border border-deep-300 px-4 py-2 text-sm font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">
                    <UserPlus className="h-4 w-4" /> Add to group
                  </Link>
                  {currentUser && currentUser.id === user.id && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleDeleteService(user.id); }}
                      disabled={deletingId === user.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {loading && <p className="py-12 text-center text-deep-500 dark:text-deep-400">Loading...</p>}
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-deep-500 dark:text-deep-400">
                {services.length === 0 ? "No skill swappers yet." : "No matches. Try a different search or filter."}
              </p>
              {currentUser && services.length === 0 && (
                <Link href="/service/create" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
                  <Briefcase className="h-4 w-4" /> Create a service so others can book you
                </Link>
              )}
              {!currentUser && services.length === 0 && (
                <p className="mt-2 text-sm text-deep-500 dark:text-deep-400">
                  <Link href="/signup" className="text-brand-500 hover:underline">Sign up</Link> and create your bookable profile.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
