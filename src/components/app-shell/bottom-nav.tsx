"use client";

import { CircleDollarSign, ClipboardList, PieChart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Add", href: appRoutes.add, icon: CircleDollarSign },
  { label: "Review", href: appRoutes.review, icon: ClipboardList },
  { label: "Stats", href: appRoutes.stats, icon: PieChart },
  { label: "Settings", href: appRoutes.settings, icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800/50 bg-[#0a0a0f]/95 shadow-[0_-12px_32px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mx-auto grid max-w-[420px] grid-cols-4 gap-1 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-medium text-zinc-600 transition-colors",
                "hover:bg-zinc-900 hover:text-zinc-300",
                isActive && "bg-zinc-900 text-emerald-400",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
