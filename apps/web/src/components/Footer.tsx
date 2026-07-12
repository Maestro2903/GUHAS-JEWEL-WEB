import Link from "next/link";
import Logo from "./Logo";
import { footerColumns } from "@/lib/data";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-cream">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Fine jewelry crafted to be treasured. Timeless design, ethical
              materials, made to last a lifetime.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-burgundy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Contact Us
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li>
                Phone:{" "}
                <a href="tel:+917904021379" className="hover:text-burgundy">
                  +91 79040 21379
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:guhasjewellery1978@gmail.com"
                  className="hover:text-burgundy"
                >
                  guhasjewellery1978@gmail.com
                </a>
              </li>
              <li className="pt-2 leading-relaxed">
                No. 06, Thiru. V. Ka. Road
                <br />
                Landmark: P.T. Bus Service
                <br />
                Karur, Tamil Nadu 639001
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-black/10 pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} GUHAS GEMS AND JEWELLERIES. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[InstagramIcon, FacebookIcon, TwitterIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white transition-transform hover:-translate-y-0.5 hover:bg-burgundy-dark"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
