type LogoProps = {
  className?: string;
  tone?: "dark" | "light";
};

export default function Logo({ className = "", tone = "dark" }: LogoProps) {
  const primary = tone === "light" ? "text-white" : "text-ink";
  const secondary = tone === "light" ? "text-white/70" : "text-burgundy";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className={`font-serif text-2xl uppercase tracking-[0.14em] ${primary} sm:text-[26px]`}
      >
        Guhas
      </span>
      <span
        className={`mt-1 text-[8px] font-semibold uppercase tracking-[0.28em] ${secondary} sm:text-[10px] sm:tracking-[0.32em]`}
      >
        Gems &amp; Jewelleries
      </span>
    </span>
  );
}
