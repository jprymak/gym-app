import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import { initialExercises } from "@/lib/constants/exercise";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

function CustomPrismaAdapter(p: typeof db) {
  return {
    ...PrismaAdapter(p),
    // eslint-disable-next-line
    // @ts-ignore
    createUser: (data) => {
      return p.user.create({
        data: {
          ...data,
          exercise: {
            create: initialExercises,
          },
        },
      });
    },
  };
}

export const options: NextAuthOptions = {
  // eslint-disable-next-line
  // @ts-ignore
  adapter: CustomPrismaAdapter(db),
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
          const foundUser = await db.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

          if (foundUser) {
            const match = await bcrypt.compare(
              credentials?.password,
              foundUser.password!
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
    GithubProvider({
      async profile(profile) {
        const username = profile?.name || "";
        return {
          image: profile.avatar_url,
          id: profile.id,
          email: undefined,
          name: username,
          role: "trainer",
        };
      },
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      async profile(profile) {
        const username = profile?.given_name || "";
        return {
          image: profile.picture,
          name: username,
          email: undefined,
          id: profile.sub,
          role: "trainer",
        };
      },
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
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
