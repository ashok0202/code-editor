"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LogOut, User, Sparkles, FolderCode } from "lucide-react";
import Link from "next/link";

interface UserModelProps {
  session: Session;
}

const UserModel: React.FC<UserModelProps> = ({ session }) => {
  const { user } = session;

  // Generate initials for placeholder
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || "U";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center group">
          {user.image ? (
            <Image
              className="rounded-full border-2 border-emerald-500/80 group-hover:border-emerald-400 group-hover:scale-105 transition-all shadow-md"
              alt="profile"
              src={user.image}
              width={34}
              height={34}
              unoptimized
            />
          ) : (
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-white font-semibold border-2 border-emerald-500/80 text-sm shadow-md group-hover:border-emerald-400 group-hover:scale-105 transition-all select-none">
              {initials}
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 bg-[#101018]/95 backdrop-blur-xl border border-gray-800/80 text-gray-200 rounded-2xl p-1.5 shadow-2xl z-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-3 py-3 rounded-xl bg-gray-900/60 border border-gray-800/50 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Signed in as
              </span>
              <div className="text-sm font-bold text-white truncate">
                {user.name || user.username}
              </div>
              <div className="text-xs text-gray-400 truncate mt-0.5 font-normal">
                {user.email}
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-800/80 my-1" />

          <DropdownMenuGroup className="space-y-0.5">
            <Link href="/profile" className="no-underline block">
              <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-200 rounded-xl hover:bg-blue-500/15 hover:text-blue-300 focus:bg-blue-500/15 cursor-pointer outline-none transition-all border border-transparent hover:border-blue-500/30">
                <User className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>

            <Link href="/snippets" className="no-underline block">
              <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-200 rounded-xl hover:bg-purple-500/15 hover:text-purple-300 focus:bg-purple-500/15 cursor-pointer outline-none transition-all border border-transparent hover:border-purple-500/30">
                <FolderCode className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span>My Snippets</span>
              </DropdownMenuItem>
            </Link>

            {user.role === "admin" && (
              <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-amber-300 rounded-xl hover:bg-amber-500/15 hover:text-amber-200 focus:bg-amber-500/15 cursor-pointer outline-none transition-all border border-transparent hover:border-amber-500/30">
                <Sparkles className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Admin Panel</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-800/80 my-1" />

          <DropdownMenuItem
            onClick={handleSignOut}
            className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-400 rounded-xl hover:bg-rose-500/15 hover:text-rose-300 focus:bg-rose-500/15 data-highlighted:bg-rose-500/15 cursor-pointer outline-none transition-all border border-transparent hover:border-rose-500/30"
          >
            <LogOut className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserModel;
