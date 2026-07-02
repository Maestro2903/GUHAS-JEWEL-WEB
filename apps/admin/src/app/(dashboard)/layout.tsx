import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { USER_EMAIL_HEADER } from "@repo/supabase/middleware";
import NavLinks from "@/components/NavLinks";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The root middleware already validated the session (authoritative getUser)
  // and forwards the signed-in email via a request header. Read it here instead
  // of hitting the Auth server a second time on every navigation. Absence means
  // no valid session slipped through — fall back to the login redirect.
  const email = (await headers()).get(USER_EMAIL_HEADER);
  if (!email) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-black/10 bg-white p-5 lg:flex">
        <div className="px-2 pb-6">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl uppercase tracking-[0.08em] text-ink">
              Guhas
            </span>
            <span className="text-xs uppercase tracking-wider text-muted">
              Admin
            </span>
          </div>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-burgundy">
            Gems &amp; Jewelleries
          </span>
        </div>
        <NavLinks vertical />
        <div className="mt-auto px-1 pt-6">
          <p className="mb-3 truncate text-xs text-muted">{email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 lg:hidden">
          <span className="font-serif text-lg uppercase tracking-[0.06em] text-ink">
            Guhas{" "}
            <span className="text-[10px] font-semibold tracking-[0.18em] text-burgundy">
              Gems &amp; Jewelleries
            </span>
          </span>
          <SignOutButton />
        </header>
        <div className="border-b border-black/10 bg-white px-4 py-2 lg:hidden">
          <NavLinks />
        </div>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
