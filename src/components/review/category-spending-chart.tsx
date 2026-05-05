"use client";

import { formatCurrency } from "@/lib/currency";

type CategorySpendingChartProps = {
  data: Array<{ category: string; total: number }>;
  currency: string;
};

export function CategorySpendingChart({ data, currency }: CategorySpendingChartProps) {
  const maxAmount = Math.max(...data.map((category) => category.total), 1);

  return (
    <div className="w-full min-w-0 space-y-3 overflow-hidden rounded-xl bg-zinc-900">
      {data.map((category) => {
        const barWidth = (category.total / maxAmount) * 100;

        return (
          <div key={category.category} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-right text-xs text-zinc-400">
              {category.category}
            </span>
            <div className="h-2 flex-1 rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="shrink-0 text-xs whitespace-nowrap text-zinc-400">
              {formatCurrency(category.total, currency)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
