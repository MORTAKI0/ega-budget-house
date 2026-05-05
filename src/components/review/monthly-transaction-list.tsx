"use client";

import { Component, type ReactNode, useState } from "react";
import { useQuery } from "convex/react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { api } from "@convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryStatistics } from "@/components/review/category-statistics";
import { MonthlySummaryCards } from "@/components/review/monthly-summary-cards";
import { SafeBalanceStatus } from "@/components/review/safe-balance-status";
import { formatCurrency } from "@/lib/currency";
import { formatDisplayDate, formatMonthLabel, getMonthKey } from "@/lib/dates";
import { groupTransactionsByDay } from "@/lib/review-transactions";
import { cn } from "@/lib/utils";

class ReviewErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <Card className="mt-6 rounded-2xl border border-zinc-800/50 bg-zinc-900">
          <CardContent className="space-y-2 p-4">
            <p className="font-medium text-rose-400">Could not load transactions.</p>
            <p className="text-sm text-zinc-300">{this.state.message}</p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function MonthlyTransactionList() {
  return (
    <ReviewErrorBoundary>
      <MonthlyTransactionListContent />
    </ReviewErrorBoundary>
  );
}

function MonthlyTransactionListContent() {
  const [selectedMonth, setSelectedMonth] = useState(() => getMonthKey());
  const summary = useQuery(api.monthlySummary.get, {
    monthKey: selectedMonth,
  });
  const settings = useQuery(api.monthlySettings.get, {
    monthKey: selectedMonth,
  });
  const transactions = useQuery(api.transactions.listByMonth, {
    monthKey: selectedMonth,
  });

  function handleMonthChange(direction: -1 | 1) {
    setSelectedMonth((currentMonth) => shiftMonth(currentMonth, direction));
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-[420px] min-w-0 flex-1 flex-col gap-5 font-[var(--font-sora,ui-sans-serif)]">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900 px-4 py-3">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CalendarDays className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
            <p className="min-w-0 truncate font-medium text-white">{formatMonthLabel(selectedMonth)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => handleMonthChange(-1)}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleMonthChange(1)}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <MonthlySummaryCards summary={summary} isLoading={summary === undefined} />

      <SafeBalanceStatus
        summary={summary}
        hasSettings={settings !== null}
        monthKey={selectedMonth}
        isLoading={summary === undefined || settings === undefined}
      />

      <CategoryStatistics summary={summary} isLoading={summary === undefined} />

      <div className="space-y-3">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-base font-semibold text-white">
            {formatMonthLabel(selectedMonth)}
          </h2>
          {transactions ? (
            <Badge variant="outline" className="border-zinc-800/50 text-zinc-400">
              {transactions.length} saved
            </Badge>
          ) : null}
        </div>

        {transactions === undefined ? (
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
            <CardContent className="flex min-h-40 items-center justify-center p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Loader2 className="size-4 animate-spin" />
                Loading transactions
              </div>
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
            <CardContent className="space-y-1 p-4 py-8 text-center">
              <p className="font-medium text-white">No transactions for this month yet.</p>
              <p className="text-sm text-zinc-500">
                Add income or expense, then return here to verify it saved.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5 pb-4">
            {groupTransactionsByDay(transactions).map((group) => (
              <section key={group.dayKey} className="space-y-3">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <h3 className="min-w-0 truncate text-xs font-medium text-zinc-500">
                    {group.label}
                  </h3>
                  <Badge variant="outline" className="shrink-0 border-zinc-800/50 text-zinc-500">
                    {group.transactions.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {group.transactions.map((transaction) => (
                    <TransactionCard key={transaction._id} transaction={transaction} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type Transaction = NonNullable<
  ReturnType<typeof useQuery<typeof api.transactions.listByMonth>>
>[number];

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const Icon = isIncome ? ArrowUpCircle : ArrowDownCircle;

  return (
    <Card className="rounded-xl border border-zinc-800/40 bg-zinc-900 py-0">
      <CardContent className="space-y-3 px-4 py-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-800",
                isIncome ? "text-emerald-400" : "text-rose-400",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    isIncome
                      ? "rounded-full bg-emerald-500/15 px-2 text-[10px] text-emerald-400"
                      : "rounded-full bg-rose-500/15 px-2 text-[10px] text-rose-400",
                  )}
                >
                  {isIncome ? "Income" : "Expense"}
                </Badge>
                <span className="min-w-0 break-words text-sm text-zinc-300">
                  {transaction.category?.name ?? "Unknown category"}
                </span>
              </div>
              <p className="text-xs text-zinc-600">{formatDisplayDate(transaction.occurredAt)}</p>
            </div>
          </div>

          <p
            className={cn(
              "self-end text-right text-base font-medium whitespace-nowrap tabular-nums sm:shrink-0",
              isIncome ? "text-emerald-400" : "text-rose-400",
            )}
          >
            <span className="whitespace-nowrap">
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </p>
        </div>

        {transaction.note ? (
          <p className="break-words rounded-xl bg-zinc-800/60 px-3 py-2 text-sm text-zinc-300">
            {transaction.note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function shiftMonth(monthKey: string, offset: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);

  return getMonthKey(date);
}
