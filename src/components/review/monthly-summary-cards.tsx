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
      <section className="grid min-w-0 gap-3 sm:grid-cols-2">
        {loadingCards.map((label) => (
          <Card key={label} className="border-emerald-100 bg-white shadow-sm">
            <CardContent className="flex min-h-28 items-center justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-600">{label}</p>
                <div className="h-6 w-28 rounded-full bg-emerald-50" />
              </div>
              <Loader2 className="size-5 animate-spin text-emerald-700" aria-hidden="true" />
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
      className: "border-emerald-100 bg-emerald-50/70 text-emerald-800",
      valueClassName: "text-emerald-800",
      helper: "Money in this month",
    },
    {
      label: "Expenses",
      value: safeSummary.totalExpenses,
      prefix: "-",
      icon: ArrowDownCircle,
      className: "border-zinc-200 bg-zinc-50 text-zinc-700",
      valueClassName: "text-zinc-950",
      helper: "Money out this month",
    },
    {
      label: "Current balance",
      value: safeSummary.currentBalance,
      prefix: "",
      icon: Wallet,
      className: "border-emerald-100 bg-white text-emerald-800",
      valueClassName: "text-emerald-950",
      helper: "Starting balance plus net change",
    },
    {
      label: "Net change",
      value: safeSummary.netChange,
      prefix: safeSummary.netChange > 0 ? "+" : "",
      icon: Scale,
      className: "border-emerald-100 bg-white text-emerald-800",
      valueClassName: safeSummary.netChange >= 0 ? "text-emerald-800" : "text-red-700",
      helper: "Income minus expenses",
    },
  ];

  return (
    <section className="min-w-0 space-y-3">
      {!hasActivity ? (
        <Card className="border-dashed border-emerald-200 bg-emerald-50/70 shadow-sm">
          <CardContent className="space-y-1 py-4">
            <p className="font-medium text-emerald-950">No monthly summary activity yet.</p>
            <p className="text-sm text-emerald-800">
              Add income, expenses, or monthly settings to update these balance cards.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.label} className="min-w-0 border-emerald-100 bg-white shadow-sm">
            <CardContent className="flex min-h-32 min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-medium text-zinc-600">{card.label}</p>
                <p
                  className={cn(
                    "break-words text-2xl font-semibold tabular-nums",
                    card.valueClassName,
                  )}
                >
                  {card.prefix}
                  {formatCurrency(Math.abs(card.value), safeSummary.currency)}
                </p>
                <p className="text-xs font-medium text-zinc-500">{card.helper}</p>
              </div>
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border",
                  card.className,
                )}
              >
                <card.icon className="size-5" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
