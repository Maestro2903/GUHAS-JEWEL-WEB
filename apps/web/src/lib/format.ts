// Single place to control how prices are displayed across the site.
// Change CURRENCY_SYMBOL to "$" (and the locale) if needed.
export const CURRENCY_SYMBOL = "₹";
const LOCALE = "en-IN";

export function formatPrice(price: number | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  return `${CURRENCY_SYMBOL}${price.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
