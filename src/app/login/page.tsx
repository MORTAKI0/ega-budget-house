import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicRoutes } from "@/lib/routes";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Authentication placeholder for release foundation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            href={publicRoutes.signup}
          >
            Need account? Sign up
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
