"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { navLinks } from "@/lib/data";
import {
  PhoneIcon,
  MenuIcon,
  CloseIcon,
  ChevronDown,
  InstagramIcon,
  FacebookIcon,
} from "./Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-x">
          {/* ---------- Desktop header — logo · centered nav · CTA ---------- */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-6 py-5 lg:grid">
            <Link
              href="/"
              className="shrink-0 justify-self-start"
              aria-label="Guhas Gems and Jewelleries home"
            >
              <Logo />
            </Link>
            <nav className="flex items-center justify-center gap-9">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link ${active ? "text-burgundy after:w-full" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="justify-self-end">
              <Link href="/contact" className="btn-outline whitespace-nowrap">
                Visit Us
              </Link>
            </div>
          </div>

          {/* ---------- Mobile / tablet header ---------- */}
          <div className="lg:hidden">
            <div className="flex items-center py-4">
              <div className="flex flex-1 justify-start">
                <button
                  aria-label="Open menu"
                  onClick={() => setOpen(true)}
                  className="-ml-1 p-1 text-ink"
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex justify-center">
                <Link href="/" aria-label="Guhas Gems and Jewelleries home">
                  <Logo />
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-end">
                <Link
                  href="/contact"
                  aria-label="Contact us"
                  className="p-1 text-ink hover:text-burgundy"
                >
                  <PhoneIcon className="h-[22px] w-[22px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Mobile drawer (outside header so position:fixed isn't
           trapped by the header's backdrop-filter) ---------- */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[310px] max-w-[86%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <Logo />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-1 text-ink hover:text-burgundy"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between border-b border-black/5 py-3.5 text-[15px] font-medium uppercase tracking-[0.05em] transition-colors hover:text-burgundy ${
                        active ? "text-burgundy" : "text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white hover:bg-burgundy-dark"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white hover:bg-burgundy-dark"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </nav>

          <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
            <button className="flex items-center gap-1 text-sm text-ink hover:text-burgundy">
              INR <ChevronDown className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted">Handcrafted with love</p>
          </div>
        </aside>
      </div>
    </>
  );
}
