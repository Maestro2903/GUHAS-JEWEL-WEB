"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@repo/supabase";
import { formatPrice } from "@/lib/format";
import { ChevronLeft, ChevronRight } from "./Icons";

const PLACEHOLDER = "/images/product-makers-slice.png";

export default function TopProducts({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [active, setActive] = useState<string>("all");

  if (!products.length) return null;

  const tabs = [
    { label: "All", slug: "all" },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ];

  const visible = (
    active === "all"
      ? products
      : products.filter((p) => p.category?.slug === active)
  ).slice(0, 8);

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-serif text-3xl text-burgundy sm:text-4xl">
          Top Product
        </h2>

        <div className="flex items-center gap-6">
          <div className="no-scrollbar flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActive(tab.slug)}
                className={`relative whitespace-nowrap pb-1 text-sm transition-colors ${
                  active === tab.slug
                    ? "font-semibold text-burgundy"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {tab.label}
                {active === tab.slug && (
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-burgundy" />
                )}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink/40">
              <ChevronLeft className="h-5 w-5" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink/40">
              <ChevronRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {visible.map((product) => {
          const price = formatPrice(product.price);
          return (
            <div key={product.id} className="group text-center">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-md border border-black/5 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                <Image
                  src={product.image_url || PLACEHOLDER}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-5 font-serif text-lg text-ink">{product.name}</h3>
              {price ? (
                <p className="mt-1 text-sm font-semibold text-burgundy">{price}</p>
              ) : (
                <Link
                  href="/products"
                  className="mt-1 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-burgundy/80 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
                >
                  View
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
