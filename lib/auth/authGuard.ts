import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function authGuard(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
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