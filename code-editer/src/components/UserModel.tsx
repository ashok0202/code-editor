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
        <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center">
          {user.image ? (
            <Image
              className="rounded-full border-2 border-emerald-500 hover:border-emerald-400 transition-colors"
              alt="profile"
              src={user.image}
              width={34}
              height={34}
              unoptimized
            />
          ) : (
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-white font-semibold border-2 border-emerald-500 text-sm shadow-md hover:from-blue-500 hover:to-purple-500 transition-all select-none">
              {initials}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-950/95 backdrop-blur-md border border-gray-800/80 text-gray-200 rounded-xl p-1 shadow-2xl z-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-3 py-2.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Signed in as
              </span>
              <div className="text-sm font-semibold text-white truncate">
                {user.name || user.username}
              </div>
              <div className="text-xs text-gray-400 truncate mt-0.5">{user.email}</div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="bg-gray-800/80 my-1" />
          
          <DropdownMenuGroup>
            <Link href="/profile" className="no-underline">
            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-800/50 cursor-pointer focus:bg-gray-800/50 outline-none transition-colors">
              <User className="h-4 w-4 text-gray-400" />
              <span>Profile</span>
            </DropdownMenuItem>
            </Link>
            
            <Link href="/snippets" className="no-underline">
              <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-800/50 cursor-pointer focus:bg-gray-800/50 outline-none transition-colors text-gray-200">
                <FolderCode className="h-4 w-4 text-gray-400" />
                <span>My Snippets</span>
              </DropdownMenuItem>
            </Link>

            {user.role === "admin" && (
              <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-800/50 cursor-pointer focus:bg-gray-800/50 outline-none transition-colors">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 font-medium">Admin Panel</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="bg-gray-800/80 my-1" />
          
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 cursor-pointer focus:bg-rose-950/20 outline-none transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserModel;
