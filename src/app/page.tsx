import Link from "next/link";
import { ArrowRight, PieChart, ShieldCheck, Smartphone, UserPlus, Wallet, Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Add transactions fast",
    description: "Record expenses and income in seconds.",
    icon: Zap,
  },
  {
    title: "Review monthly spending",
    description: "See where your money goes and stay in control.",
    icon: PieChart,
  },
  {
    title: "Stay above your safe balance",
    description: "Keep your finances steady with a clear goal.",
    icon: ShieldCheck,
  },
] as const;

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7fbf5] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <BackgroundDecorations />

      <section className="relative z-10 flex w-full max-w-6xl items-center justify-center">
        <MonthlyOverviewCard />

        <Card className="w-full max-w-2xl rounded-[2rem] border-white/80 bg-white/95 px-5 py-9 text-center shadow-[0_24px_70px_rgba(15,76,41,0.14)] ring-1 ring-emerald-950/5 backdrop-blur sm:px-9 sm:py-11">
          <CardContent className="px-0">
            <div className="mx-auto mb-7 flex size-32 items-center justify-center rounded-full bg-emerald-100/70 sm:size-36">
              <div className="relative flex size-24 items-center justify-center rounded-2xl bg-emerald-600 shadow-[0_16px_32px_rgba(22,163,74,0.28)] ring-1 ring-emerald-800/10 sm:size-28">
                <Wallet className="size-13 text-white sm:size-16" strokeWidth={1.7} aria-hidden />
                <span className="absolute top-1/2 -right-3 size-9 -translate-y-1/2 rounded-full border-4 border-emerald-700 bg-white shadow-sm" />
                <span className="absolute -top-4 right-4 h-8 w-16 -rotate-12 rounded-md bg-emerald-300/90 shadow-sm" />
                <span className="absolute bottom-2 -left-7 h-10 w-4 -rotate-[35deg] rounded-full bg-emerald-700/85" />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-normal text-emerald-950 sm:text-5xl">
              EGA BUDGET HOUSE
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-xl">
              Track your spending, protect your balance, and review your month with clarity.
            </p>

            <div className="mt-8 grid gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:grid-cols-3 sm:gap-0 sm:p-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={cn(
                      "flex flex-col items-center px-2 py-2",
                      index > 0 && "sm:border-l sm:border-emerald-950/10",
                    )}
                  >
                    <span className="mb-4 flex size-13 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Icon className="size-7" fill="currentColor" strokeWidth={1.8} aria-hidden />
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-5 text-slate-500">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-[0_14px_28px_rgba(22,163,74,0.22)] hover:bg-emerald-700",
                )}
                href={publicRoutes.login}
              >
                Log in
                <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 rounded-xl border-emerald-600 bg-white text-base font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800",
                )}
                href={publicRoutes.signup}
              >
                <UserPlus className="size-5" aria-hidden />
                Create account
              </Link>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <Smartphone className="size-4" aria-hidden />
              Install as app on your phone
              <ArrowRight className="size-4" aria-hidden />
            </p>
          </CardContent>
        </Card>

        <SavingsGoalCard />
      </section>
    </main>
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
          <div className="size-16 rounded-full bg-[conic-gradient(#16a34a_0deg_238deg,#d9f2df_238deg_360deg)] p-3">
            <div className="size-full rounded-full bg-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Budget</p>
            <p className="mt-1 text-base font-black text-slate-700">$1,850</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Spent</p>
            <p className="mt-1 font-black text-slate-700">$1,120</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Left</p>
            <p className="mt-1 font-black text-emerald-600">$730</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SavingsGoalCard() {
  return (
    <Card
      aria-hidden
      className="pointer-events-none absolute top-20 right-6 hidden w-44 rounded-2xl border-white/90 bg-white/90 p-0 shadow-[0_18px_45px_rgba(15,76,41,0.12)] ring-1 ring-emerald-950/5 lg:block"
    >
      <CardContent className="p-5">
        <p className="text-xs font-semibold text-slate-500">Savings Goal</p>
        <p className="mt-4 text-2xl font-black text-slate-700">72%</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-[72%] rounded-full bg-emerald-500" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-500">$1,800 / $2,500</p>
      </CardContent>
    </Card>
  );
}

function BackgroundDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-52 -left-40 size-[30rem] rounded-full border-[88px] border-emerald-100/80" />
      <div className="absolute -right-28 -bottom-44 size-[24rem] rounded-full bg-emerald-100/80" />
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
          strokeWidth="4"
          strokeLinecap="round"
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
