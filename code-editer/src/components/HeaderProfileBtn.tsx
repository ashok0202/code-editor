"use client";

import UserModel from "@/components/UserModel";
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { LogIn } from "lucide-react";

interface HeaderProfileBtnProps {
  session?: Session | null;
}

const HeaderProfileBtn: React.FC<HeaderProfileBtnProps> = ({ session: initialSession }) => {
  const { data: clientSession, status } = useSession();
  const session = initialSession !== undefined ? initialSession : clientSession;

  if (status === "loading" && session === undefined) {
    return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        title="Sign In"
        className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div>
      <UserModel session={session} />
    </div>
  );
};

export default HeaderProfileBtn;

