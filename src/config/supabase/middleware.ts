import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { protectedRoutes, authRoutes } from "./paths";

export const updateSession = async (request: NextRequest) => {
  // creates unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // creates supabase server-client instance with options
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // Upon failed authentication check, user is redirected back to login
  // accessing any nested route starting with protected route will be blocked if not authenticated
  const isProtected = Array.from(protectedRoutes).some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && user.error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Upon passing authentication check, user is redirected to dashboard
  // also preventing auth-routes (login, signup, etc) from being accessed
  if (authRoutes.has(request.nextUrl.pathname) && !user.error) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
};
