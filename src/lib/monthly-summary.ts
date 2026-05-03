import { CATEGORY_ORDER, INCOME_CATEGORY } from "@/lib/categories";
import { DEFAULT_CURRENCY } from "@/lib/currency";

export type MonthlySummaryTransaction = {
  id?: string;
  _id?: string;
  amount: number;
  type: "expense" | "income";
  category?: string | { name?: string | null } | null;
  occurredAt?: number | string;
  date?: number | string;
  monthKey?: string;
  note?: string;
};

export type MonthlySummarySettings = {
  startingBalance?: number;
  safeBalanceGoal?: number;
  currency?: string;
} | null;

export type MonthlySummary = {
  monthKey: string;
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  startingBalance: number;
  currentBalance: number;
  safeBalanceGoal: number;
  availableToSpend: number;
  currency: string;
  categoryTotals: Array<{
    category: string;
    total: number;
  }>;
  topCategories: Array<{
    category: string;
    total: number;
  }>;
  largestExpense: null | {
    id: string;
    amount: number;
    category: string;
    occurredAt: string;
    note?: string;
  };
};

export function buildMonthlySummary({
  monthKey,
  transactions,
  monthlySettings,
  categoryOrder = CATEGORY_ORDER,
}: {
  monthKey: string;
  transactions: MonthlySummaryTransaction[];
  monthlySettings?: MonthlySummarySettings;
  categoryOrder?: readonly string[];
}): MonthlySummary {
  const selectedTransactions = transactions.filter(
    (transaction) => !transaction.monthKey || transaction.monthKey === monthKey,
  );

  const totalIncome = selectedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = selectedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const startingBalance = monthlySettings?.startingBalance ?? 0;
  const safeBalanceGoal = monthlySettings?.safeBalanceGoal ?? 0;
  const netChange = totalIncome - totalExpenses;
  const currentBalance = startingBalance + netChange;
  const availableToSpend = currentBalance - safeBalanceGoal;
  const categoryRank = new Map(categoryOrder.map((category, index) => [category, index]));
  const categoryTotalsByName = new Map<string, number>();

  for (const transaction of selectedTransactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    const category = getTransactionCategory(transaction);

    if (category === INCOME_CATEGORY) {
      continue;
    }

    categoryTotalsByName.set(category, (categoryTotalsByName.get(category) ?? 0) + transaction.amount);
  }

  const categoryTotals = Array.from(categoryTotalsByName.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      return getCategoryRank(a.category, categoryRank) - getCategoryRank(b.category, categoryRank);
    });

  const largestExpenseTransaction = selectedTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort(compareExpenseTransactions)[0];

  return {
    monthKey,
    totalIncome,
    totalExpenses,
    netChange,
    startingBalance,
    currentBalance,
    safeBalanceGoal,
    availableToSpend,
    currency: monthlySettings?.currency || DEFAULT_CURRENCY,
    categoryTotals,
    topCategories: categoryTotals.slice(0, 3),
    largestExpense: largestExpenseTransaction
      ? {
          id: largestExpenseTransaction.id ?? largestExpenseTransaction._id ?? "",
          amount: largestExpenseTransaction.amount,
          category: getTransactionCategory(largestExpenseTransaction),
          occurredAt: formatOccurredAt(largestExpenseTransaction.occurredAt ?? largestExpenseTransaction.date),
          ...(largestExpenseTransaction.note ? { note: largestExpenseTransaction.note } : {}),
        }
      : null,
  };
}

function getTransactionCategory(transaction: MonthlySummaryTransaction): string {
  if (typeof transaction.category === "string") {
    return transaction.category;
  }

  return transaction.category?.name || "Other";
}

function getCategoryRank(category: string, categoryRank: Map<string, number>): number {
  return categoryRank.get(category) ?? Number.MAX_SAFE_INTEGER;
}

function compareExpenseTransactions(
  a: MonthlySummaryTransaction,
  b: MonthlySummaryTransaction,
): number {
  if (b.amount !== a.amount) {
    return b.amount - a.amount;
  }

  const bTime = getTransactionTime(b);
  const aTime = getTransactionTime(a);

  if (bTime !== aTime) {
    return bTime - aTime;
  }

  return String(a.id ?? a._id ?? "").localeCompare(String(b.id ?? b._id ?? ""));
}

function getTransactionTime(transaction: MonthlySummaryTransaction): number {
  const date = transaction.occurredAt ?? transaction.date;

  if (typeof date === "number") {
    return date;
  }

  return date ? new Date(date).getTime() : 0;
}

function formatOccurredAt(value: number | string | undefined): string {
  if (typeof value === "number") {
    return new Date(value).toISOString();
  }

  return value ?? "";
}
