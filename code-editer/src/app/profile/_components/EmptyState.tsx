"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  iconBgColor = "bg-blue-500/10 text-blue-400 border-blue-500/20",
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card className="bg-[#12121c]/60 border-gray-800/60 p-12 text-center rounded-3xl">
      <CardContent className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-full border ${iconBgColor}`}>{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            {description}
          </p>
        </div>
        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            <Sparkles className="w-4 h-4" />
            {actionText}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
