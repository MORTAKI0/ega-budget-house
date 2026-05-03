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
      <Card className="border-emerald-100 bg-white shadow-sm">
        <CardContent className="flex min-h-36 items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
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
      <Card className="border-dashed border-emerald-200 bg-emerald-50/70 shadow-sm">
        <CardContent className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-emerald-950">Set your monthly safe balance in Settings.</p>
            <p className="text-sm text-emerald-800">
              Review can protect spending once {monthKey} has a safe balance goal.
            </p>
          </div>
          <Link
            href="/settings"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
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
          "border bg-white shadow-sm",
          isSafe ? "border-emerald-100" : "border-red-200",
        )}
      >
        <CardContent className="min-w-0 space-y-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border",
                isSafe
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              <StatusIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className={cn("font-semibold", isSafe ? "text-emerald-950" : "text-red-800")}>
                {statusLabel}
              </p>
              <p className="text-sm text-zinc-600">
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
              valueClassName={isSafe ? "text-emerald-800" : "text-red-700"}
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
    <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
      <div className="mb-2 flex min-w-0 items-center gap-2">
        <Icon className="size-4 shrink-0 text-emerald-800" aria-hidden="true" />
        <p className="min-w-0 break-words text-sm font-medium text-zinc-600">{label}</p>
      </div>
      <p className={cn("break-words text-lg font-semibold tabular-nums text-emerald-950", valueClassName)}>
        {formatCurrency(value, currency)}
      </p>
    </div>
  );
}
