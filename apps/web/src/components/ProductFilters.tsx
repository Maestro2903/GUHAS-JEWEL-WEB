"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Opt = { value: string; label: string; count?: number };
type Item = { category: string; metal: string; price: string };
type Current = {
  category: string;
  metal: string;
  price: string;
  sort: string;
  view: string;
};

function buildUrl(n: Current): string {
  const params = new URLSearchParams();
  if (n.category) params.set("category", n.category);
  if (n.metal) params.set("metal", n.metal);
  if (n.price) params.set("price", n.price);
  if (n.sort && n.sort !== "featured") params.set("sort", n.sort);
  if (n.view && n.view !== "grid") params.set("view", n.view);
  // page intentionally omitted → any change returns to page 1
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

function labelOf(opts: Opt[], value: string): string {
  return opts.find((o) => o.value === value)?.label ?? value;
}

function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-burgundy bg-burgundy text-white"
          : "border-black/15 text-ink/70 hover:border-burgundy hover:text-burgundy"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onSelect,
}: {
  title: string;
  options: Opt[];
  value: string;
  onSelect: (v: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        <OptionChip active={!value} onClick={() => onSelect("")}>
          All
        </OptionChip>
        {options.map((o) => (
          <OptionChip
            key={o.value}
            active={value === o.value}
            onClick={() => onSelect(o.value)}
          >
            {o.label}
            {o.count != null && (
              <span className={active(value, o.value)}> ({o.count})</span>
            )}
          </OptionChip>
        ))}
      </div>
    </div>
  );
}

// tiny helper to dim the count on unselected chips
function active(value: string, v: string): string {
  return value === v ? "opacity-90" : "opacity-60";
}

export default function ProductFilters({
  categories,
  metals,
  priceRanges,
  items,
  sorts,
  current,
}: {
  categories: Opt[];
  metals: Opt[];
  priceRanges: Opt[];
  items: Item[];
  sorts: Opt[];
  current: Current;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState({
    category: current.category,
    metal: current.metal,
    price: current.price,
  });

  const openPanel = () => {
    setSel({ category: current.category, metal: current.metal, price: current.price });
    setOpen(true);
  };

  const go = (patch: Partial<Current>) =>
    router.push(buildUrl({ ...current, ...patch }));

  const apply = () => {
    setOpen(false);
    router.push(buildUrl({ ...current, ...sel }));
  };

  const liveCount = items.filter(
    (it) =>
      (!sel.category || it.category === sel.category) &&
      (!sel.metal || it.metal === sel.metal) &&
      (!sel.price || it.price === sel.price)
  ).length;

  const activeCount = [current.category, current.metal, current.price].filter(
    Boolean
  ).length;

  const viewBtn = (isActive: boolean) =>
    `flex h-9 w-9 items-center justify-center transition-colors ${
      isActive ? "bg-burgundy text-white" : "bg-white text-ink/50 hover:text-burgundy"
    }`;

  return (
    <div className="mb-8 border-y border-black/10 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Single Filters control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => (open ? setOpen(false) : openPanel())}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-burgundy hover:text-burgundy"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm3 4h8a1 1 0 010 2H6a1 1 0 010-2zm2 4h4a1 1 0 010 2H8a1 1 0 010-2z" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1.5 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 sm:bg-black/10"
                onClick={() => setOpen(false)}
              />
              <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] space-y-5 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-[calc(100%+0.5rem)] sm:max-h-[70vh] sm:w-[340px] sm:rounded-xl sm:border sm:border-black/10 sm:shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-ink">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close filters"
                    className="text-ink/50 hover:text-burgundy"
                  >
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <FilterGroup
                  title="Category"
                  options={categories}
                  value={sel.category}
                  onSelect={(v) => setSel((s) => ({ ...s, category: v }))}
                />
                <FilterGroup
                  title="Metal"
                  options={metals}
                  value={sel.metal}
                  onSelect={(v) => setSel((s) => ({ ...s, metal: v }))}
                />
                <FilterGroup
                  title="Price"
                  options={priceRanges}
                  value={sel.price}
                  onSelect={(v) => setSel((s) => ({ ...s, price: v }))}
                />

                <div className="flex items-center gap-3 border-t border-black/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setSel({ category: "", metal: "", price: "" })}
                    className="text-sm font-medium text-ink/60 hover:text-burgundy"
                  >
                    Clear
                  </button>
                  <button type="button" onClick={apply} className="btn-primary ml-auto !py-2.5">
                    Show {liveCount} {liveCount === 1 ? "piece" : "pieces"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort + view (kept separate from filters) */}
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={current.sort}
              onChange={(e) => go({ sort: e.target.value })}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-sm text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/10"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex overflow-hidden rounded-full border border-black/15">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={current.view !== "list"}
              onClick={() => go({ view: "grid" })}
              className={viewBtn(current.view !== "list")}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" rx="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={current.view === "list"}
              onClick={() => go({ view: "list" })}
              className={viewBtn(current.view === "list")}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <rect x="2" y="3" width="4" height="4" rx="1" />
                <rect x="8" y="4" width="10" height="2" rx="1" />
                <rect x="2" y="13" width="4" height="4" rx="1" />
                <rect x="8" y="14" width="10" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips (removable) */}
      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {current.category && (
            <RemovableChip
              label={labelOf(categories, current.category)}
              onRemove={() => go({ category: "" })}
            />
          )}
          {current.metal && (
            <RemovableChip
              label={labelOf(metals, current.metal)}
              onRemove={() => go({ metal: "" })}
            />
          )}
          {current.price && (
            <RemovableChip
              label={labelOf(priceRanges, current.price)}
              onRemove={() => go({ price: "" })}
            />
          )}
          <button
            type="button"
            onClick={() => go({ category: "", metal: "", price: "" })}
            className="text-sm font-medium text-burgundy underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm text-ink">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-ink/50 hover:text-burgundy"
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}
