import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Request header used to forward the validated user email to downstream
 * Server Components, so they don't need a second round-trip to the Auth
 * server just to know who is signed in. */
export const USER_EMAIL_HEADER = "x-user-email";

/**
 * Refreshes the auth session on every request and returns both the response
 * (with refreshed cookies) and the current user. Used by the admin app's
 * root middleware to keep sessions alive and gate protected routes.
 *
 * The validated email is forwarded downstream via the `x-user-email` request
 * header so Server Components (e.g. the dashboard layout) can render the
 * signed-in user without repeating the `getUser()` network call.
 */
export const updateSession = async (request: NextRequest) => {
  // Copy incoming headers so we can forward the authenticated email downstream.
  // Delete any client-supplied value first — it must ONLY ever be set by us,
  // from a server-validated session, so it can't be spoofed by a request header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(USER_EMAIL_HEADER);

  // Collect the cookies Supabase wants to refresh; applied to the final
  // response once, after we know the user (keeps exact name/value/options).
  const cookiesToApply: CookieToSet[] = [];

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToApply.push(...cookiesToSet);
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    requestHeaders.set(USER_EMAIL_HEADER, user.email);
  }

  const supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });
  cookiesToApply.forEach(({ name, value, options }) =>
    supabaseResponse.cookies.set(name, value, options)
  );

  return { supabaseResponse, user };
};
