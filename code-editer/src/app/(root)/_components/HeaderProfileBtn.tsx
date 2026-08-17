import UserModel from "@/components/UserModel";
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";

interface HeaderProfileBtnProps {
  session: Session | null;
}

const HeaderProfileBtn: React.FC<HeaderProfileBtnProps> = ({ session }) => {
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
