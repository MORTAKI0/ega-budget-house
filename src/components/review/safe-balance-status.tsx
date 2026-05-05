"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type SafeBalanceSummary = {
  currentBalance: number;
  safeBalanceGoal: number;
  availableToSpend: number;
  currency: string;
};

type SafeBalanceStatusProps = {
  summary: SafeBalanceSummary | null | undefined;
  hasSettings?: boolean;
  monthKey: string;
  isLoading?: boolean;
};

export function SafeBalanceStatus({
  summary,
  hasSettings,
  monthKey,
  isLoading,
}: SafeBalanceStatusProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
        <CardContent className="flex min-h-36 items-center justify-center p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading safe balance
          </div>
        </CardContent>
      </Card>
    );
  }

  const safeSummary =
    summary ??
    ({
      currentBalance: 0,
      safeBalanceGoal: 0,
      availableToSpend: 0,
      currency: "MAD",
    } satisfies SafeBalanceSummary);

  const hasConfiguredSafeBalance = Boolean(hasSettings && safeSummary.safeBalanceGoal > 0);

  if (!hasConfiguredSafeBalance) {
    return (
      <Card className="rounded-2xl border border-zinc-700/50 bg-zinc-800/60">
        <CardContent className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-zinc-300">Set your monthly safe balance in Settings.</p>
            <p className="text-sm text-zinc-500">
              Review can protect spending once {monthKey} has a safe balance goal.
            </p>
          </div>
          <Link
            href="/settings"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Open Settings
          </Link>
        </CardContent>
      </Card>
    );
  }

  const isSafe = safeSummary.availableToSpend > 0;
  const statusLabel = isSafe ? "Safe" : "Warning";
  const StatusIcon = isSafe ? CheckCircle2 : AlertTriangle;

  return (
    <section className="min-w-0 space-y-3">
      <Card
        className={cn(
          "rounded-2xl border bg-zinc-900",
          isSafe ? "border-zinc-800/50" : "border-zinc-700/50",
        )}
      >
        <CardContent className="min-w-0 space-y-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-800",
                isSafe
                  ? "text-emerald-400"
                  : "text-rose-400",
              )}
            >
              <StatusIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className={cn("font-semibold", isSafe ? "text-white" : "text-rose-400")}>
                {statusLabel}
              </p>
              <p className="text-sm text-zinc-300">
                {isSafe
                  ? "You are above your protected safe balance."
                  : "Warning: you have reached or crossed your protected safe balance."}
              </p>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            <SafeBalanceMetric
              label="Safe balance goal"
              value={safeSummary.safeBalanceGoal}
              currency={safeSummary.currency}
              icon={ShieldCheck}
            />
            <SafeBalanceMetric
              label="Current balance"
              value={safeSummary.currentBalance}
              currency={safeSummary.currency}
              icon={WalletCards}
            />
            <SafeBalanceMetric
              label="Available to spend"
              value={safeSummary.availableToSpend}
              currency={safeSummary.currency}
              icon={StatusIcon}
              valueClassName={isSafe ? "text-emerald-400" : "text-rose-400"}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SafeBalanceMetric({
  label,
  value,
  currency,
  icon: Icon,
  valueClassName,
}: {
  label: string;
  value: number;
  currency: string;
  icon: LucideIcon;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-800/50 bg-zinc-900 p-3">
      <div className="mb-2 flex min-w-0 items-center gap-2">
        <Icon className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <p className="min-w-0 break-words text-xs font-medium text-zinc-500">{label}</p>
      </div>
      <p className={cn("break-words text-lg font-semibold tabular-nums text-white", valueClassName)}>
        {formatCurrency(value, currency)}
      </p>
    </div>
  );
}
