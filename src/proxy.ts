import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (renamed from Middleware in Next.js 16).
 *
 * Two jobs, both cheap:
 *
 * 1. Refresh the Supabase auth cookie so server components see a live session.
 *    This has to happen here because Server Components cannot write cookies.
 * 2. An *optimistic* gate on /admin — bounce requests with no session before
 *    they render. This is a UX shortcut, not the security boundary: it runs on
 *    prefetches and does not check the profile row or role. Authorization lives
 *    in `src/lib/auth/dal.ts`, next to the data.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without a backend the admin area renders its own setup notice, so there is
  // nothing to gate and no session to refresh.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Required to refresh an expired token; do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  if (!user && pathname.startsWith("/admin") && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  // Only /admin needs session handling. Keeping the public marketing pages out
  // of the matcher means they stay fully static and never pay for this.
  matcher: ["/admin/:path*"],
};
