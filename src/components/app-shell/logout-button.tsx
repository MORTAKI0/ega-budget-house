"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/lib/routes";

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace(publicRoutes.login);
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="mt-6 h-12 w-full rounded-xl border-emerald-100 bg-white text-emerald-900 hover:bg-emerald-50"
    >
      <LogOut className="size-4" aria-hidden />
      {isSigningOut ? "Logging out" : "Log out"}
    </Button>
  );
}
