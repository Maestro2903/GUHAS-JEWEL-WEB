import { unstable_cache } from "next/cache";

export type MetalRate = {
  key: string;
  label: string;
  value: number | null; // INR per unit, or null when unavailable
  unit: string;
  note?: string;
};

async function fetchSymbol(
  symbol: string
): Promise<Record<string, unknown> | null> {
  const key = process.env.GOLDAPI_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://www.goldapi.io/api/${symbol}/INR`, {
      headers: { "x-access-token": key, "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function gram(data: Record<string, unknown> | null, field: string): number | null {
  const v = data?.[field];
  return typeof v === "number" ? v : null;
}

async function loadRates(): Promise<{ rates: MetalRate[]; updatedAt: string | null }> {
  // One call per metal (each returns 24k/22k/18k gram prices for gold).
  const [gold, silver, platinum] = await Promise.all([
    fetchSymbol("XAU"),
    fetchSymbol("XAG"),
    fetchSymbol("XPT"),
  ]);

  const rates: MetalRate[] = [
    { key: "gold24", label: "Gold 24K", value: gram(gold, "price_gram_24k"), unit: "per gram" },
    { key: "gold22", label: "Gold 22K", value: gram(gold, "price_gram_22k"), unit: "per gram" },
    { key: "silver", label: "Silver", value: gram(silver, "price_gram_24k"), unit: "per gram" },
    { key: "platinum", label: "Platinum", value: gram(platinum, "price_gram_24k"), unit: "per gram" },
  ];

  const anyLive = rates.some((r) => r.value != null);
  return { rates, updatedAt: anyLive ? new Date().toISOString() : null };
}

/**
 * Live metal rates in INR/gram, cached 24h so we call goldapi.io ~3×/day
 * (~90 requests/month) — safely within its free-tier quota — regardless of
 * traffic. Null values (no key / API down) render as "On request".
 */
export const getMetalRates = unstable_cache(loadRates, ["metal-rates-inr-v3"], {
  revalidate: 86400,
});
