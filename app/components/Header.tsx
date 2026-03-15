"use client";

import Link from "next/link";
import { ArrowRight, Menu, X, Shield, LogOut, Briefcase, Users, UsersRound, ChevronDown, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";
import { AdminVerifiedBadge } from "./AdminVerifiedBadge";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#premium", label: "Premium" },
  { href: "/#pricing", label: "Pricing" },
];

const communityLinks = [
  { href: "/service/create", label: "Start creating services", icon: Briefcase },
  { href: "/browse", label: "Browse skills", icon: Users },
  { href: "/groups", label: "Groups", icon: UsersRound },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const { isAdmin, adminEmail, logoutAdmin } = useAuth();
  const { user, logout } = useUser();
  const loggedIn = isAdmin || user;

  return (
    <header className="sticky top-0 z-50 border-b border-deep-200 bg-white/90 backdrop-blur dark:border-deep-800 dark:bg-deep-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-deep-900 dark:text-white">
          <span className="rounded-lg bg-brand-500 px-2 py-0.5 text-white">SkillSwap</span>
          <span className="text-deep-600 dark:text-deep-300">Pro</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-deep-600 hover:text-brand-500 dark:text-deep-300 dark:hover:text-brand-400">
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCommunityOpen((o) => !o)}
              onBlur={() => setTimeout(() => setCommunityOpen(false), 150)}
              className="flex items-center gap-1 text-sm font-medium text-deep-600 hover:text-brand-500 dark:text-deep-300 dark:hover:text-brand-400"
            >
              Community <ChevronDown className={`h-4 w-4 transition ${communityOpen ? "rotate-180" : ""}`} />
            </button>
            {communityOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-deep-200 bg-white py-1 shadow-lg dark:border-deep-700 dark:bg-deep-900">
                {communityLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-deep-700 hover:bg-deep-50 dark:text-deep-200 dark:hover:bg-deep-800"
                    onClick={() => setCommunityOpen(false)}
                  >
                    <l.icon className="h-4 w-4 shrink-0" />
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <AdminVerifiedBadge size="sm" />
              <span className="font-semibold">Admin</span>
              <Shield className="h-4 w-4" />
            </Link>
          )}
          <Link href="/settings" className="flex items-center gap-1.5 text-sm font-medium text-deep-600 hover:text-brand-500 dark:text-deep-300 dark:hover:text-brand-400">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAdmin ? (
            <>
              <span className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                <AdminVerifiedBadge size="sm" />
                <span>{adminEmail ?? "Admin"}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  logout();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-deep-600 hover:bg-deep-100 dark:hover:bg-deep-800"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </>
          ) : user ? (
            <>
              <span className="text-sm font-medium text-deep-700 dark:text-deep-200">{user.name} {user.surname}</span>
              <button type="button" onClick={() => logout()} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-deep-600 hover:bg-deep-100 dark:hover:bg-deep-800">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-deep-600 hover:bg-deep-100 dark:hover:bg-deep-800">
                Log in
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
        <button type="button" className="rounded-lg p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-deep-200 bg-white px-4 py-4 dark:border-deep-800 dark:bg-deep-950 md:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 font-medium" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <p className="mt-2 border-t border-deep-200 pt-2 text-xs font-semibold uppercase tracking-wider text-deep-500 dark:border-deep-700 dark:text-deep-400">Community</p>
          {communityLinks.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2 py-2 font-medium pl-2" onClick={() => setOpen(false)}>
              <l.icon className="h-4 w-4 shrink-0" />
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 py-2 font-semibold text-green-600 dark:text-green-400" onClick={() => setOpen(false)}>
              <AdminVerifiedBadge size="sm" /> Admin
            </Link>
          )}
          <Link href="/settings" className="flex items-center gap-2 py-2 font-medium" onClick={() => setOpen(false)}><Settings className="h-4 w-4" /> Settings</Link>
          <Link href="/contact" className="block py-2 font-medium" onClick={() => setOpen(false)}>Contact us</Link>
          {!loggedIn && (
            <>
              <Link href="/login" className="block py-2 font-medium" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" className="inline-flex items-center gap-1.5 py-2 font-medium text-brand-500" onClick={() => setOpen(false)}>Get started <ArrowRight className="h-4 w-4" /></Link>
            </>
          )}
          {user && !isAdmin && (
            <button type="button" onClick={() => { setOpen(false); logout(); }} className="flex items-center gap-2 py-2 font-medium text-deep-600">Log out</button>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logoutAdmin();
                logout();
              }}
              className="flex items-center gap-2 py-2 font-medium text-deep-600"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
