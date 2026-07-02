"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@repo/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-burgundy hover:text-burgundy"
    >
      Sign out
    </button>
  );
}
