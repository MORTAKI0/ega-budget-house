import { type ReactNode } from "react";

import { BottomNav } from "@/components/app-shell/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0a0a0f]">
      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pt-6 pb-28 sm:px-6 sm:pt-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
