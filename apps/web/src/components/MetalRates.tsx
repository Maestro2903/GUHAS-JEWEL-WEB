import { getMetalRates } from "@/lib/rates";

const CURRENCY = "₹";

export default async function MetalRates() {
  const { rates, updatedAt } = await getMetalRates();

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section className="border-y border-burgundy/10 bg-cream">
      <div className="container-x py-10 lg:py-12">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <h2 className="font-serif text-2xl text-burgundy sm:text-3xl">
            Today&apos;s Rates
          </h2>
          <p className="text-xs text-muted">
            {updatedLabel
              ? `Indicative retail rates · updated ${updatedLabel}`
              : "Indicative retail rates · contact us for today's price"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {rates.map((rate) => (
            <div
              key={rate.key}
              className="flex flex-col items-center rounded-lg border border-black/5 bg-white px-4 py-5 text-center shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
                {rate.label}
              </span>
              {rate.value != null ? (
                <>
                  <span className="mt-2 font-serif text-2xl text-ink sm:text-[26px]">
                    {CURRENCY}
                    {Math.round(rate.value).toLocaleString("en-IN")}
                  </span>
                  <span className="mt-0.5 text-xs text-muted">{rate.unit}</span>
                </>
              ) : (
                <span className="mt-2 font-serif text-xl text-ink/70">
                  {rate.note ?? "On request"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
