import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {prisma} from "./db/prisma";
import bcrypt from "bcryptjs";
import { loginFormSchema } from "./lib/zod";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const {data, success} = loginFormSchema.safeParse(credentials);
        if (!success) {
          throw new Error("Credenciales invalidas")
        }
        const userFound = await prisma.user.findFirst({
          where:{
            email: data.email
          }
        });
        if (!userFound ) {
          throw new Error("Credenciales invalidas")
        }
        
        const isPasswordValid = await bcrypt.compare(
          data.password, userFound.password
        );
        if (!isPasswordValid) {
          throw new Error("Credenciales invalidas")
        }
        return userFound;
    }
}),
],
  
} satisfies NextAuthConfig