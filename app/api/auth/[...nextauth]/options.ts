import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "@/lib/db";

const MINUTE = 60;
const HOUR = 60 * MINUTE;

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "your email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const foundUser = await db.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (foundUser) {
            const match = await bcrypt.compare(
              credentials?.password,
              foundUser.password
            );

            if (match) {
              return foundUser;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  session: {
    maxAge: 8 * HOUR,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
    signOut: "/signOut",
  },
};
