"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useUser } from "@/app/context/UserContext";
import { Briefcase, MapPin, DollarSign, Trash2 } from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CreateServicePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [tagline, setTagline] = useState("");
  const [offersText, setOffersText] = useState("");
  const [wantsText, setWantsText] = useState("");
  const [location, setLocation] = useState("");
  const [paidPrice, setPaidPrice] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadExisting, setLoadExisting] = useState(true);
  const [hasExistingService, setHasExistingService] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !loadExisting) return;
    fetch("/api/services/mine")
      .then((r) => r.json())
      .then((data) => {
        if (data.service) {
          setHasExistingService(true);
          setTagline(data.service.tagline || "");
          setOffersText((data.service.offers || []).join(", "));
          setWantsText((data.service.wants || []).join(", "));
          setLocation(data.service.location || "");
          setPaidPrice(data.service.paidPrice != null ? String(data.service.paidPrice) : "");
          setLevel(data.service.level || "Beginner");
          setBio(data.service.bio || "");
        }
        setLoadExisting(false);
      })
      .catch(() => setLoadExisting(false));
  }, [user, loadExisting]);

  const handleDelete = async () => {
    if (!confirm("Delete your service? You will no longer appear in Browse. You can create a new one anytime.")) return;
    setError("");
    setDeleting(true);
    try {
      const res = await fetch("/api/services", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete");
        return;
      }
      setHasExistingService(false);
      setTagline("");
      setOffersText("");
      setWantsText("");
      setLocation("");
      setPaidPrice("");
      setLevel("Beginner");
      setBio("");
      router.push("/browse");
    } catch {
      setError("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const offers = parseList(offersText);
    if (!tagline.trim()) {
      setError("Tagline is required");
      return;
    }
    if (offers.length === 0) {
      setError("Add at least one skill you offer");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline: tagline.trim(),
          offers,
          wants: parseList(wantsText),
          location: location.trim(),
          paidPrice: paidPrice.trim() ? parseFloat(paidPrice) : null,
          level: level.trim() || "Beginner",
          bio: bio.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      router.push("/browse");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20 flex items-center justify-center">
          <p className="text-deep-500">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
          <div className="mx-auto max-w-md px-4 py-12 text-center">
            <p className="text-deep-600 dark:text-deep-400">Sign in to create a service so others can book you.</p>
            <Link href="/login" className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">Log in</Link>
            <span className="mx-2 text-deep-400">|</span>
            <Link href="/signup" className="text-brand-500 hover:underline">Sign up</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 shadow-sm dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <Briefcase className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Create a service</h1>
            </div>
            <p className="mt-2 text-sm text-deep-600 dark:text-deep-400">
              Set up your bookable profile. Others will see this when they browse and can book sessions with you.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  placeholder="e.g. Design & code"
                  className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Skills I offer</label>
                <input
                  type="text"
                  value={offersText}
                  onChange={(e) => setOffersText(e.target.value)}
                  required
                  placeholder="e.g. Graphic design, Figma, UI/UX (comma-separated)"
                  className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Skills I want to learn</label>
                <input
                  type="text"
                  value={wantsText}
                  onChange={(e) => setWantsText(e.target.value)}
                  placeholder="e.g. Spanish, Video editing (comma-separated)"
                  className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Location</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-10 pr-4 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Paid price per session (optional)</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-400" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={paidPrice}
                    onChange={(e) => setPaidPrice(e.target.value)}
                    placeholder="Leave empty for free swap only"
                    className="w-full rounded-lg border border-deep-200 bg-white py-2.5 pl-10 pr-4 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Short bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="A few words about you and your experience."
                  className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save service"}
                </button>
                <Link href="/browse" className="rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">Cancel</Link>
                {hasExistingService && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || deleting}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "Deleting..." : "Delete service"}
                  </button>
                )}
              </div>
            </form>
            <p className="mt-4 text-sm text-deep-500 dark:text-deep-400">
              Your profile will appear in Browse so others can find and book sessions with you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
