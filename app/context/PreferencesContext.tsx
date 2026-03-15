"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "skillswap-preferences";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR" | "JPY";
export type LanguageCode = "en" | "es" | "fr" | "de" | "pt" | "hi" | "ja";

type StoredPrefs = {
  currency: CurrencyCode;
  language: LanguageCode;
};

const defaultPrefs: StoredPrefs = {
  currency: "USD",
  language: "en",
};

const VALID_CURRENCIES: CurrencyCode[] = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY"];
const VALID_LANGUAGES: LanguageCode[] = ["en", "es", "fr", "de", "pt", "hi", "ja"];

function load(): StoredPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw) as Partial<StoredPrefs>;
    return {
      currency: parsed.currency && VALID_CURRENCIES.includes(parsed.currency) ? parsed.currency : defaultPrefs.currency,
      language: parsed.language && VALID_LANGUAGES.includes(parsed.language) ? parsed.language : defaultPrefs.language,
    };
  } catch {
    return defaultPrefs;
  }
}

function save(prefs: StoredPrefs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

// Simple display conversion from USD (base). For production you'd use live rates.
const USD_TO: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  INR: 83.12,
  JPY: 149.5,
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  JPY: "¥",
};

function formatWithCurrency(amountUsd: number, currency: CurrencyCode): string {
  const rate = USD_TO[currency];
  const local = amountUsd * rate;
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === "JPY" || currency === "INR") {
    return `${symbol}${Math.round(local).toLocaleString()}`;
  }
  return `${symbol}${local.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type PreferencesContextValue = {
  currency: CurrencyCode;
  language: LanguageCode;
  currencySymbol: string;
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LanguageCode) => void;
  formatPrice: (amountUsd: number) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<StoredPrefs>(defaultPrefs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrefs(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    save(prefs);
    if (typeof document !== "undefined") {
      document.documentElement.lang = prefs.language;
    }
  }, [mounted, prefs]);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setPrefs((p) => ({ ...p, currency }));
  }, []);

  const setLanguage = useCallback((language: LanguageCode) => {
    setPrefs((p) => ({ ...p, language }));
  }, []);

  const formatPrice = useCallback(
    (amountUsd: number) => formatWithCurrency(amountUsd, prefs.currency),
    [prefs.currency]
  );

  const value: PreferencesContextValue = {
    currency: prefs.currency,
    language: prefs.language,
    currencySymbol: CURRENCY_SYMBOLS[prefs.currency],
    setCurrency,
    setLanguage,
    formatPrice,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

export const CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
];

export const LANGUAGES: { value: LanguageCode; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "hi", label: "हिन्दी" },
  { value: "ja", label: "日本語" },
];
