export const CURRENCY_SYMBOL = "₹";

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "—";
  return `${CURRENCY_SYMBOL}${price.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
