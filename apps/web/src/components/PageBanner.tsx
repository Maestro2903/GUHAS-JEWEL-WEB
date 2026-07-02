export default function PageBanner({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-cream">
      <div className="container-x py-14 text-center lg:py-20">
        <h1 className="font-serif text-4xl text-burgundy sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
