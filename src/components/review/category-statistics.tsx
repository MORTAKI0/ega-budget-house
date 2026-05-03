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
      <Card className="border-emerald-100 bg-white shadow-sm">
        <CardContent className="flex min-h-44 items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
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
      <Card className="border-dashed border-emerald-200 bg-emerald-50/70 shadow-sm">
        <CardContent className="space-y-2 py-6">
          <div className="flex items-center gap-2 text-emerald-900">
            <BarChart3 className="size-5" aria-hidden="true" />
            <h2 className="font-semibold">Category statistics</h2>
          </div>
          <p className="font-medium text-emerald-950">No expenses for this month yet.</p>
          <p className="text-sm text-emerald-800">
            Add an expense to see category totals, top categories, and a spending chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex min-w-0 items-center gap-2">
        <BarChart3 className="size-5 shrink-0 text-emerald-800" aria-hidden="true" />
        <h2 className="min-w-0 text-base font-semibold text-zinc-950">Category statistics</h2>
      </div>

      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="min-w-0 space-y-3">
          <Card className="border-emerald-100 bg-white shadow-sm">
            <CardContent className="min-w-0 space-y-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                  <Trophy className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-zinc-600">Top spending category</p>
                  <p className="break-words text-xl font-semibold text-emerald-950">
                    {topCategory?.category}
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-emerald-800">
                    {formatCurrency(topCategory?.total ?? 0, currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white shadow-sm">
            <CardContent className="min-w-0 space-y-3">
              <h3 className="font-semibold text-zinc-950">Top 3 categories</h3>
              <ol className="space-y-2">
                {topCategories.map((category, index) => (
                  <li
                    key={category.category}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-emerald-50/70 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-500">#{index + 1}</p>
                      <p className="break-words font-medium text-zinc-950">{category.category}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-emerald-800">
                      {formatCurrency(category.total, currency)}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white shadow-sm">
            <CardContent className="min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-5 text-emerald-800" aria-hidden="true" />
                <h3 className="font-semibold text-zinc-950">Largest expense</h3>
              </div>
              {largestExpense ? (
                <div className="min-w-0 space-y-1">
                  <p className="break-words font-medium text-zinc-950">
                    {largestExpense.category}
                  </p>
                  <p className="text-lg font-semibold tabular-nums text-zinc-950">
                    {formatCurrency(largestExpense.amount, currency)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {formatExpenseDate(largestExpense.occurredAt)}
                  </p>
                  {largestExpense.note ? (
                    <p className="break-words rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                      {largestExpense.note}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-zinc-600">No expenses for this month yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 border-emerald-100 bg-white shadow-sm">
          <CardContent className="min-w-0 space-y-3">
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold text-zinc-950">Spending by category</h3>
              <p className="text-sm text-zinc-600">
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
