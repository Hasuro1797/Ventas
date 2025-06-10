import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function authGuard(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET, 
    cookieName: process.env.NODE_ENV === "production" ? '__Secure-authjs.session-token': 'authjs.session-token'
  });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401, 
      headers:{
        'Content-Type': 'application/json'
      } 
    });
  }
  return token;
}