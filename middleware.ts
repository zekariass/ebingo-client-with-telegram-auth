
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createServerClient } from "@supabase/ssr";
// import { nextI18NextConfig as cnf } from "./next-i18next.config";

// // Define paths that require authentication
// const PROTECTED_PATHS = ["/admin", "/rooms", "/transactions", "/wallets", "/game-payments"];

// export async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const { pathname } = url;

//   // --- 1) Locale handling ---
//   const segments = pathname.split("/");
//   const maybeLocale = segments[1];

//   if (!cnf.locales.includes(maybeLocale)) {
//     // redirect: preserve path and prefix with defaultLocale
//     return NextResponse.redirect(
//       new URL(`/${cnf.defaultLocale}${pathname}`, req.url)
//     );
//   }

//   const locale = maybeLocale;
//   const pathWithoutLocale = "/" + segments.slice(2).join("/");

//   // --- 2) Authentication check for protected routes ---
//   if (PROTECTED_PATHS.some((path) => pathWithoutLocale.startsWith(path))) {
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//       {
//         cookies: {
//           getAll() {
//             return req.cookies.getAll();
//           },
//         },
//       }
//     );

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       // Redirect to login page in the correct locale
//       return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
//     }
//   }

//   // --- 3) Continue request ---
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { nextI18NextConfig as cnf } from "./next-i18next.config";

const PROTECTED_PATHS = [
  "/admin",
  "/rooms",
  "/transactions",
  "/wallet",
  "/game-payments",
  "/transfer",
  "/withdraw",
  "/deposit"
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const res = NextResponse.next();

  // --- 1) Locale handling ---
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (!cnf.locales.includes(maybeLocale)) {
    const newUrl = new URL(req.url);
    newUrl.pathname = `/${cnf.defaultLocale}${pathname}`;
    return NextResponse.redirect(newUrl);
  }

  const locale = maybeLocale;
  const pathWithoutLocale = "/" + segments.slice(2).join("/");

  // --- 2) Auth for protected routes ---
  if (PROTECTED_PATHS.some((path) => pathWithoutLocale.startsWith(path))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // --- 3) Continue ---
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)"],
};
