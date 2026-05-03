import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicRoutes } from "@/lib/routes";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">EGA BUDGET HOUSE</CardTitle>
          <CardDescription>
            Monthly budget foundation for adding transactions, reviewing spending, and protecting
            safe balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            href={publicRoutes.login}
          >
            Log in
          </Link>
          <Link
            className="flex h-11 flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50"
            href={publicRoutes.signup}
          >
            Sign up
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
