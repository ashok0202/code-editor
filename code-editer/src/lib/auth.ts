import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { getServerSession, type NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Please enter your email/username and password");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.emailOrUsername },
              { username: credentials.emailOrUsername },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No user found with those credentials");
        }

        const isPasswordCorrect = await bcryptjs.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // whenever any jwt is created or updated this function runs
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.image = user.image;
        token.role = user.role;
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            name: true,
            email: true,
            username: true,
            image: true,
            role: true,
          },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.username = dbUser.username;
          token.image = dbUser.image;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export const getAuthsession = () => getServerSession(authOptions);
