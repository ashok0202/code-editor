import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { getServerSession, type NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";

// Session duration configuration (24 hours)
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
    maxAge: SESSION_MAX_AGE,
    updateAge: 60 * 60, // Refresh session token age every hour
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
        } else {
          // User was deleted or deactivated - invalidate token
          return {} as any;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
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
export const getAuthSession = getAuthsession;

/**
 * Checks if a session object is expired.
 */
export const isSessionExpired = (session: { expires?: string } | null | undefined): boolean => {
  if (!session || !session.expires) return true;
  return new Date(session.expires) < new Date();
};

/**
 * Gets the current server session.
 * If session is not present or session time has expired, automatically redirects to the sign-in/login page.
 */
export const requireAuthSession = async (redirectTo: string = authOptions.pages?.signIn || "/sign-in") => {
  const session = await getAuthsession();

  if (!session || !session.user || isSessionExpired(session)) {
    redirect(redirectTo);
  }

  return session;
};

