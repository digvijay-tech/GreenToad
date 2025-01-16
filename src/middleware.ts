import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/config/supabase/middleware";
import { createClient } from "@/config/supabase/server";

export async function middleware(request: NextRequest) {
  // creating new supbase instance
  const supabase = await createClient();

  // verifying if the user data is there
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // when user data is missing redirect back to login '/'
  // making sure infinite loop is not triggered when redirecting
  if (!user && !request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
