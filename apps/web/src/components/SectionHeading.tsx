type Props = {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  children,
  className = "",
  align = "center",
}: Props) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <h2 className="font-serif text-3xl text-burgundy sm:text-4xl">{children}</h2>
      <div
        className={`heading-rule ${align === "left" ? "ml-0" : ""}`}
      />
    </div>
  );
}
