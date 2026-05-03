import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicRoutes } from "@/lib/routes";

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Account creation placeholder for release foundation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            href={publicRoutes.login}
          >
            Have account? Log in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
