"use client";

import { Component, type ReactNode, useState } from "react";
import { useQuery } from "convex/react";
import { ArrowDownCircle, ArrowUpCircle, CalendarDays, Loader2 } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Card className="mt-6 border-red-100 bg-white shadow-sm">
          <CardContent className="space-y-2">
            <p className="font-medium text-red-700">Could not load transactions.</p>
            <p className="text-sm text-red-600">{this.state.message}</p>
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
  const transactions = useQuery(api.transactions.listByMonth, {
    monthKey: selectedMonth,
  });

  return (
    <section className="mt-6 flex min-w-0 flex-1 flex-col gap-5">
      <Card className="border-emerald-100 bg-white shadow-sm">
        <CardContent className="space-y-2">
          <Label htmlFor="review-month">Selected month</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-700" />
            <Input
              id="review-month"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="h-12 rounded-xl border-emerald-100 bg-emerald-50/60 pr-3 pl-10 font-medium text-emerald-950 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-base font-semibold text-zinc-950">
            {formatMonthLabel(selectedMonth)}
          </h2>
          {transactions ? (
            <Badge variant="outline" className="border-emerald-200 text-emerald-800">
              {transactions.length} saved
            </Badge>
          ) : null}
        </div>

        {transactions === undefined ? (
          <Card className="border-emerald-100 bg-white shadow-sm">
            <CardContent className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                <Loader2 className="size-4 animate-spin" />
                Loading transactions
              </div>
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card className="border-dashed border-emerald-200 bg-emerald-50/70 shadow-sm">
            <CardContent className="space-y-1 py-8 text-center">
              <p className="font-medium text-emerald-950">No transactions for this month yet.</p>
              <p className="text-sm text-emerald-800">
                Add income or expense, then return here to verify it saved.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5 pb-4">
            {groupTransactionsByDay(transactions).map((group) => (
              <section key={group.dayKey} className="space-y-3">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <h3 className="min-w-0 truncate text-sm font-semibold text-zinc-700">
                    {group.label}
                  </h3>
                  <Badge variant="outline" className="shrink-0 border-zinc-200 text-zinc-600">
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
    <Card className="border-emerald-100 bg-white shadow-sm">
      <CardContent className="space-y-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full",
                isIncome ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-700",
              )}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    isIncome
                      ? "bg-emerald-700 text-white"
                      : "bg-zinc-900 text-white",
                  )}
                >
                  {isIncome ? "Income" : "Expense"}
                </Badge>
                <span className="min-w-0 break-words text-sm font-medium text-zinc-800">
                  {transaction.category?.name ?? "Unknown category"}
                </span>
              </div>
              <p className="text-sm text-zinc-500">{formatDisplayDate(transaction.occurredAt)}</p>
            </div>
          </div>

          <p
            className={cn(
              "self-end text-right text-base font-semibold tabular-nums sm:shrink-0 sm:text-lg",
              isIncome ? "text-emerald-700" : "text-zinc-950",
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        {transaction.note ? (
          <p className="break-words rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            {transaction.note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
