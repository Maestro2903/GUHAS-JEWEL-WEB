export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const promos = [
  {
    id: "birthday",
    eyebrow: "Must See New Style",
    title: "Birthday Collection",
    image: "/images/promo-birthday.png",
  },
  {
    id: "summer",
    eyebrow: "New collection",
    title: "Summer Essentials",
    image: "/images/promo-summer.png",
  },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/products" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Rings", href: "/products?category=rings" },
      { label: "Bracelets", href: "/products?category=bracelets" },
      { label: "Pendants", href: "/products?category=pendants" },
      { label: "Earrings", href: "/products?category=earrings" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Visit Us", href: "/contact" },
      { label: "Care Guide", href: "/about" },
      { label: "Custom Orders", href: "/contact" },
      { label: "Our Story", href: "/about" },
    ],
  },
];
