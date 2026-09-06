"use client";

import UserModel from "@/components/UserModel";
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

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
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-md"
      >
        Sign In
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

