import { NextRequest, NextResponse } from 'next/server'
import { authroutes, routes, privateRoutes } from './lib/routes'
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest){
  const {nextUrl} = req;
  const isLoggedIn = await getToken({
    req, 
    secret: process.env.AUTH_SECRET, 
    cookieName: process.env.NODE_ENV === "production" ? '__Secure-authjs.session-token': 'authjs.session-token'
  });
  console.log("el log", isLoggedIn);
  if (nextUrl.pathname === routes.home) {
    return NextResponse.redirect(new URL(routes.signin, req.nextUrl));
  }

  if (privateRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = routes.signin;
    url.search = `?p=${nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }
  
  if (authroutes.includes(nextUrl.pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL(routes.products, req.nextUrl));
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/clients/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/((?!.*\\..*|_next).*)",
  ],
}
