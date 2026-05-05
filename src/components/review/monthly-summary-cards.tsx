"use client";

import { ArrowDownCircle, ArrowUpCircle, Loader2, Scale, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type MonthlySummary = {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  currentBalance: number;
  currency: string;
};

type MonthlySummaryCardsProps = {
  summary: MonthlySummary | null | undefined;
  isLoading?: boolean;
};

const loadingCards = ["Income", "Expenses", "Current balance", "Net change"];

export function MonthlySummaryCards({ summary, isLoading }: MonthlySummaryCardsProps) {
  if (isLoading) {
    return (
      <section className="grid min-w-0 grid-cols-2 gap-3">
        {loadingCards.map((label) => (
          <Card key={label} className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0">
            <CardContent className="flex min-h-28 items-center justify-between gap-3 p-4">
              <div className="space-y-2">
                <p className="text-xs text-zinc-500">{label}</p>
                <div className="h-6 w-20 rounded-full bg-zinc-800" />
              </div>
              <Loader2 className="size-4 animate-spin text-zinc-500" aria-hidden="true" />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  const safeSummary =
    summary ??
    ({
      totalIncome: 0,
      totalExpenses: 0,
      netChange: 0,
      currentBalance: 0,
      currency: "MAD",
    } satisfies MonthlySummary);

  const hasActivity =
    safeSummary.totalIncome !== 0 ||
    safeSummary.totalExpenses !== 0 ||
    safeSummary.currentBalance !== 0 ||
    safeSummary.netChange !== 0;

  const cards = [
    {
      label: "Income",
      value: safeSummary.totalIncome,
      prefix: "+",
      icon: ArrowUpCircle,
      iconClassName: "text-emerald-400",
      valueClassName: "text-emerald-400",
    },
    {
      label: "Expenses",
      value: safeSummary.totalExpenses,
      prefix: "-",
      icon: ArrowDownCircle,
      iconClassName: "text-rose-400",
      valueClassName: "text-rose-400",
    },
    {
      label: "Balance",
      value: safeSummary.currentBalance,
      prefix: "",
      icon: Wallet,
      iconClassName: "text-white",
      valueClassName: "text-white",
    },
    {
      label: "Net change",
      value: safeSummary.netChange,
      prefix: safeSummary.netChange > 0 ? "+" : "",
      icon: Scale,
      iconClassName: "text-white",
      valueClassName: "text-white",
    },
  ];

  return (
    <section className="min-w-0 space-y-3">
      {!hasActivity ? (
        <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
          <CardContent className="space-y-1 p-4">
            <p className="font-medium text-white">No monthly summary activity yet.</p>
            <p className="text-sm text-zinc-500">
              Add income, expenses, or monthly settings to update these balance cards.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid min-w-0 grid-cols-2 gap-3">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0"
          >
            <CardContent className="flex min-h-28 min-w-0 items-start justify-between gap-3 p-4">
              <div className="min-w-0 space-y-2">
                <p className="text-xs text-zinc-500">{card.label}</p>
                <p
                  className={cn(
                    "overflow-hidden text-lg font-semibold whitespace-nowrap tabular-nums",
                    card.valueClassName,
                  )}
                >
                  {card.prefix}
                  {formatCurrency(Math.abs(card.value), safeSummary.currency)}
                </p>
              </div>
              <card.icon className={cn("size-4 shrink-0", card.iconClassName)} aria-hidden="true" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
