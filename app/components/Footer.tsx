import Link from "next/link";

const links = {
  Product: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Premium", href: "/#premium" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Browse skills", href: "/browse" },
    { label: "Groups", href: "/groups" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Business", href: "/business" },
    { label: "Careers", href: "/careers" },
    { label: "Contact us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-deep-200 bg-deep-50 dark:border-deep-800 dark:bg-deep-900/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-bold text-deep-900 dark:text-white">
              <span className="rounded bg-brand-500 px-2 py-0.5 text-white">SkillSwap</span>
              <span className="text-deep-600 dark:text-deep-300">Pro</span>
            </Link>
            <p className="mt-3 text-sm text-deep-600 dark:text-deep-400">Exchange real-life skills. Swap for free or pay for experts.</p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-deep-500 dark:text-deep-400">{title}</h3>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-deep-600 hover:text-brand-500 dark:text-deep-400 dark:hover:text-brand-400">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-deep-200 pt-6 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-deep-400">
          © {new Date().getFullYear()} SkillSwap Pro.
        </div>
      </div>
    </footer>
  );
}
