"use client";

import Link from "next/link";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { ArrowRight, Eye, Loader2, Lock, Mail, ShieldCheck, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultAppRoute, publicRoutes } from "@/lib/routes";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(defaultAppRoute);
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    formData.set("flow", "signUp");
    setIsSubmitting(true);

    try {
      await signIn("password", formData);
      router.replace(defaultAppRoute);
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7fbf5] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <BackgroundDecorations />

      <section className="relative z-10 flex w-full max-w-6xl min-w-0 items-center justify-center">
        <MonthlyOverviewCard />

        <Card
          className="w-full rounded-[2rem] border-white/80 bg-white/95 px-5 py-8 shadow-[0_24px_70px_rgba(15,76,41,0.14)] ring-1 ring-emerald-950/5 backdrop-blur sm:px-8 sm:py-10"
          style={{ maxWidth: "min(calc(100vw - 2rem), 36rem)" }}
        >
          <CardContent className="px-0">
            <Link
              href={publicRoutes.home}
              className="mx-auto mb-7 flex w-fit max-w-full items-center gap-3 rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-950/10 transition-colors hover:bg-emerald-100"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.24)]">
                <Wallet className="size-5" strokeWidth={1.9} aria-hidden />
              </span>
              <span className="min-w-0 truncate">EGA BUDGET HOUSE</span>
            </Link>

            <div className="text-center">
              <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-emerald-100/70">
                <div className="relative flex size-17 items-center justify-center rounded-2xl bg-emerald-600 shadow-[0_16px_32px_rgba(22,163,74,0.28)] ring-1 ring-emerald-800/10">
                  <Wallet className="size-10 text-white" strokeWidth={1.7} aria-hidden />
                  <span className="absolute top-1/2 -right-2 size-7 -translate-y-1/2 rounded-full border-4 border-emerald-700 bg-white shadow-sm" />
                  <span className="absolute -top-3 right-3 h-6 w-12 -rotate-12 rounded-md bg-emerald-300/90 shadow-sm" />
                </div>
              </div>

              <h1 className="text-3xl font-black tracking-normal text-emerald-950 sm:text-4xl">
                Create your account
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">
                Start tracking your spending and protect your monthly balance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field
                id="full-name"
                label="Full name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                icon={User}
                disabled={isSubmitting}
              />

              <Field
                id="email"
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={Mail}
                disabled={isSubmitting}
              />

              <PasswordField
                id="password"
                label="Password"
                name="password"
                autoComplete="new-password"
                placeholder="Create password"
                disabled={isSubmitting}
              />

              <PasswordField
                id="confirm-password"
                label="Confirm password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm password"
                disabled={isSubmitting}
              />

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-14 w-full rounded-xl bg-emerald-600 text-base font-bold text-white shadow-[0_14px_28px_rgba(22,163,74,0.22)] hover:bg-emerald-700"
              >
                {isSubmitting ? "Creating account" : "Create account"}
                {isSubmitting ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="size-5" aria-hidden />
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href={publicRoutes.login}
                className="font-bold text-emerald-700 hover:text-emerald-800"
              >
                Log in
              </Link>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
              <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
              Budget data stays private by design
            </p>
          </CardContent>
        </Card>

        <SecurityCard />
        <SavingsProgressCard />
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  name,
  type,
  autoComplete,
  placeholder,
  icon: Icon,
  disabled,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  icon: typeof User;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-emerald-700/70"
          aria-hidden
        />
        <Input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          disabled={disabled}
          className="h-13 rounded-xl border-emerald-950/10 bg-emerald-50/40 pr-4 pl-12 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  name,
  autoComplete,
  placeholder,
  disabled,
}: {
  id: string;
  label: string;
  name: string;
  autoComplete: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-emerald-700/70"
          aria-hidden
        />
        <Input
          id={id}
          name={name}
          type="password"
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          disabled={disabled}
          className="h-13 rounded-xl border-emerald-950/10 bg-emerald-50/40 pr-12 pl-12 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
        />
        <Eye
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
    </div>
  );
}

function MonthlyOverviewCard() {
  return (
    <Card
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-0 hidden w-44 -translate-y-1/2 rounded-2xl border-white/90 bg-white/90 p-0 shadow-[0_18px_45px_rgba(15,76,41,0.12)] ring-1 ring-emerald-950/5 lg:block"
    >
      <CardContent className="p-5">
        <p className="text-xs font-semibold text-slate-500">Monthly Overview</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="size-16 rounded-full bg-[conic-gradient(#16a34a_0deg_230deg,#d9f2df_230deg_360deg)] p-3">
            <div className="size-full rounded-full bg-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Balance</p>
            <p className="mt-1 text-base font-black text-slate-700">$2,430</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Spent</p>
            <p className="mt-1 font-black text-slate-700">$840</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Left</p>
            <p className="mt-1 font-black text-emerald-600">$1,590</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityCard() {
  return (
    <Card
      aria-hidden
      className="pointer-events-none absolute top-16 right-6 hidden w-44 rounded-2xl border-white/90 bg-white/90 p-0 shadow-[0_18px_45px_rgba(15,76,41,0.12)] ring-1 ring-emerald-950/5 lg:block"
    >
      <CardContent className="p-5">
        <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <p className="mt-4 text-xs font-semibold text-slate-500">Data Safe</p>
        <p className="mt-2 text-lg font-black text-slate-700">Private setup</p>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Protected budget space before sign in.
        </p>
      </CardContent>
    </Card>
  );
}

function SavingsProgressCard() {
  return (
    <Card
      aria-hidden
      className="pointer-events-none absolute right-20 bottom-12 hidden w-48 rounded-2xl border-white/90 bg-white/90 p-0 shadow-[0_18px_45px_rgba(15,76,41,0.12)] ring-1 ring-emerald-950/5 xl:block"
    >
      <CardContent className="p-5">
        <p className="text-xs font-semibold text-slate-500">Savings Progress</p>
        <p className="mt-4 text-2xl font-black text-slate-700">68%</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-[68%] rounded-full bg-emerald-500" />
        </div>
        <p className="mt-4 text-sm font-bold text-emerald-700">Safe balance on track</p>
      </CardContent>
    </Card>
  );
}

function BackgroundDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-52 -left-40 size-[30rem] rounded-full border-[88px] border-emerald-100/80" />
      <div className="absolute -right-28 -bottom-44 size-[24rem] rounded-full bg-emerald-100/80" />
      <div className="absolute top-18 right-1/2 size-36 translate-x-[19rem] rounded-full bg-lime-100/70 blur-2xl sm:size-48" />
      <div className="absolute bottom-16 left-0 hidden h-56 w-48 sm:block">
        <span className="absolute bottom-0 left-12 h-44 w-5 rotate-12 rounded-full bg-emerald-800/30" />
        <span className="absolute bottom-22 left-5 h-16 w-8 -rotate-45 rounded-full bg-emerald-700/50" />
        <span className="absolute bottom-34 left-22 h-20 w-9 rotate-45 rounded-full bg-emerald-600/45" />
        <span className="absolute bottom-8 left-24 h-24 w-11 rotate-[70deg] rounded-full bg-lime-700/45" />
        <span className="absolute bottom-20 left-0 h-28 w-12 -rotate-[35deg] rounded-full bg-lime-800/45" />
      </div>
      <svg
        className="absolute top-1/2 right-0 hidden h-64 w-[28rem] -translate-y-1/4 text-emerald-400/50 lg:block"
        viewBox="0 0 440 240"
        fill="none"
      >
        <path
          d="M0 170 C24 138 42 160 62 143 C91 118 100 82 132 112 C160 138 187 153 218 106 C252 55 283 42 316 70 C352 101 385 56 440 74"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="316" cy="70" r="6" fill="currentColor" />
        <path
          d="M0 212H440M64 12V228M144 12V228M224 12V228M304 12V228M384 12V228"
          stroke="#166534"
          strokeOpacity=".06"
        />
      </svg>
    </div>
  );
}
