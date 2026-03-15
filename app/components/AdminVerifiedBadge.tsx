"use client";

import { Check } from "lucide-react";

export function AdminVerifiedBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const icon = size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3";
  return (
    <span className={`inline-flex ${s} shrink-0 items-center justify-center rounded-full bg-blue-500 text-white`} title="Verified Admin">
      <Check className={`${icon} stroke-[3]`} />
    </span>
  );
}
