"use client";

import { BarChart3, Loader2, ReceiptText, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { CategorySpendingChart } from "@/components/review/category-spending-chart";
import { formatCurrency } from "@/lib/currency";

type CategorySummary = {
  currency: string;
  categoryTotals: Array<{ category: string; total: number }>;
  topCategories: Array<{ category: string; total: number }>;
  largestExpense: null | {
    id: string;
    amount: number;
    category: string;
    occurredAt: string;
    note?: string;
  };
};

type CategoryStatisticsProps = {
  summary: CategorySummary | null | undefined;
  isLoading?: boolean;
};

export function CategoryStatistics({ summary, isLoading }: CategoryStatisticsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
        <CardContent className="flex min-h-44 items-center justify-center p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading category statistics
          </div>
        </CardContent>
      </Card>
    );
  }

  const currency = summary?.currency ?? "MAD";
  const categoryTotals = filterExpenseCategories(summary?.categoryTotals ?? []);
  const topCategories = filterExpenseCategories(summary?.topCategories ?? []).slice(0, 3);
  const topCategory = topCategories[0] ?? categoryTotals[0] ?? null;
  const largestExpense = summary?.largestExpense ?? null;

  if (categoryTotals.length === 0) {
    return (
      <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900">
        <CardContent className="space-y-2 p-4 py-6">
          <div className="flex items-center gap-2 text-zinc-300">
            <BarChart3 className="size-5" aria-hidden="true" />
            <h2 className="font-semibold">Category statistics</h2>
          </div>
          <p className="font-medium text-white">No expenses for this month yet.</p>
          <p className="text-sm text-zinc-500">
            Add an expense to see category totals, top categories, and a spending chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex min-w-0 items-center gap-2">
        <BarChart3 className="size-5 shrink-0 text-emerald-400" aria-hidden="true" />
        <h2 className="min-w-0 text-base font-semibold text-white">Category statistics</h2>
      </div>

      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="min-w-0 space-y-3">
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0">
            <CardContent className="min-w-0 space-y-3 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                  <Trophy className="size-5 text-amber-400" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-zinc-500">Top spending category</p>
                  <p className="break-words text-lg font-semibold text-white">
                    {topCategory?.category}
                  </p>
                  <p className="text-sm font-semibold whitespace-nowrap tabular-nums text-rose-400">
                    {formatCurrency(topCategory?.total ?? 0, currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0">
            <CardContent className="min-w-0 space-y-1 p-4">
              <h3 className="pb-2 font-semibold text-white">Top 3 categories</h3>
              <ol className="divide-y divide-zinc-800/40">
                {topCategories.map((category, index) => (
                  <li
                    key={category.category}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400">
                        {index + 1}
                      </span>
                      <span className="min-w-0 truncate text-sm text-zinc-300">
                        {category.category}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-medium whitespace-nowrap tabular-nums text-rose-400">
                      {formatCurrency(category.total, currency)}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0">
            <CardContent className="min-w-0 space-y-3 p-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-5 text-rose-400" aria-hidden="true" />
                <h3 className="font-semibold text-white">Largest expense</h3>
              </div>
              {largestExpense ? (
                <div className="min-w-0 space-y-1">
                  <p className="break-words font-medium text-zinc-300">
                    {largestExpense.category}
                  </p>
                  <p className="text-lg font-semibold whitespace-nowrap tabular-nums text-rose-400">
                    {formatCurrency(largestExpense.amount, currency)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {formatExpenseDate(largestExpense.occurredAt)}
                  </p>
                  {largestExpense.note ? (
                    <p className="break-words rounded-xl bg-zinc-800/60 px-3 py-2 text-sm text-zinc-300">
                      {largestExpense.note}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No expenses for this month yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 rounded-2xl border border-zinc-800/50 bg-zinc-900 py-0">
          <CardContent className="min-w-0 space-y-3 p-4">
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold text-white">Spending by category</h3>
              <p className="text-sm text-zinc-500">
                Expenses only. Income category excluded from this chart and ranking.
              </p>
            </div>
            <CategorySpendingChart data={categoryTotals} currency={currency} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function filterExpenseCategories(data: Array<{ category: string; total: number }>) {
  return data.filter((item) => item.category !== "Income" && item.total > 0);
}

function formatExpenseDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
