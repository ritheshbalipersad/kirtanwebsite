"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { usePreferences } from "../context/PreferencesContext";
import { CreditCard } from "lucide-react";

export default function ProTrialPage() {
  const router = useRouter();
  const { formatPrice } = usePreferences();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const digitsOnly = cardNumber.replace(/\D/g, "");
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
      setError("Enter a valid card number (13–19 digits)");
      return;
    }
    const [mm, yy] = expiry.split("/");
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) {
      setError("Enter expiry as MM/YY");
      return;
    }
    const month = parseInt(mm, 10);
    if (month < 1 || month > 12) {
      setError("Enter a valid expiry month (01–12)");
      return;
    }
    if (cvc.replace(/\D/g, "").length < 3) {
      setError("Enter a valid CVC (3 or 4 digits)");
      return;
    }
    setLoading(true);
    try {
      // Placeholder: in production you would send to your payment API (Stripe, etc.)
      await new Promise((r) => setTimeout(r, 800));
      router.push("/signup?plan=pro&trial=started");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-md px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 shadow-sm dark:border-deep-700 dark:bg-deep-900/50">
            <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Start Pro trial</h1>
            <p className="mt-1 text-sm text-deep-600 dark:text-deep-400">Free for 3 days. Then {formatPrice(4.99)} per month from the next day. Cancel anytime.</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="given-name"
                    className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Surname</label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    autoComplete="family-name"
                    className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    placeholder="Surname"
                  />
                </div>
              </div>
              <div className="rounded-xl border-2 border-deep-200 bg-deep-50/50 p-4 dark:border-deep-700 dark:bg-deep-800/50">
                <p className="mb-3 block text-sm font-medium text-deep-700 dark:text-deep-300">Payment</p>
                <div className="flex items-center gap-2 text-xs text-deep-500 dark:text-deep-400">
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span>Accepts Visa, Mastercard, Amex, Discover and all major banks worldwide.</span>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-deep-600 dark:text-deep-400">Card number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-deep-600 dark:text-deep-400">Name on card</label>
                    <input
                      type="text"
                      autoComplete="cc-name"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      required
                      placeholder="As shown on card"
                      className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-deep-600 dark:text-deep-400">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={handleExpiryChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-deep-600 dark:text-deep-400">CVC</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        required
                        placeholder="123"
                        maxLength={4}
                        className="mt-0.5 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? "Starting trial..." : "Start Pro trial"}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-deep-500 dark:text-deep-400">
              <Link href="/" className="text-brand-500 hover:underline">Back to home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
