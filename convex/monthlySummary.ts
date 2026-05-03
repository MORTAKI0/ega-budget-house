import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { CATEGORY_ORDER, INCOME_CATEGORY } from "./categoryRules";

export const get = query({
  args: {
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_monthKey_occurredAt", (q) => q.eq("monthKey", args.monthKey))
      .order("desc")
      .collect();

    const settings = userId
      ? await ctx.db
          .query("monthlySettings")
          .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("monthKey", args.monthKey))
          .unique()
      : null;

    const categories = await ctx.db.query("categories").collect();
    const categoryById = new Map(categories.map((category) => [category._id, category]));
    const selectedTransactions = transactions.filter(
      (transaction) => transaction.monthKey === args.monthKey,
    );

    const totalIncome = selectedTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = selectedTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const startingBalance = settings?.startingBalance ?? 0;
    const safeBalanceGoal = settings?.safeBalanceGoal ?? 0;
    const netChange = totalIncome - totalExpenses;
    const currentBalance = startingBalance + netChange;
    const availableToSpend = currentBalance - safeBalanceGoal;
    const categoryRank = new Map<string, number>(
      CATEGORY_ORDER.map((category, index) => [category, index]),
    );
    const categoryTotalsByName = new Map<string, number>();

    for (const transaction of selectedTransactions) {
      if (transaction.type !== "expense") continue;

      const category = categoryById.get(transaction.categoryId);
      const categoryName = category?.name ?? "Other";

      if (categoryName === INCOME_CATEGORY) continue;

      categoryTotalsByName.set(
        categoryName,
        (categoryTotalsByName.get(categoryName) ?? 0) + transaction.amount,
      );
    }

    const categoryTotals = Array.from(categoryTotalsByName.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => {
        if (b.total !== a.total) {
          return b.total - a.total;
        }

        return (
          (categoryRank.get(a.category) ?? Number.MAX_SAFE_INTEGER) -
          (categoryRank.get(b.category) ?? Number.MAX_SAFE_INTEGER)
        );
      });

    const largestExpense = selectedTransactions
      .filter((transaction) => transaction.type === "expense")
      .sort((a, b) => {
        if (b.amount !== a.amount) {
          return b.amount - a.amount;
        }

        if (b.occurredAt !== a.occurredAt) {
          return b.occurredAt - a.occurredAt;
        }

        return String(a._id).localeCompare(String(b._id));
      })[0];

    return {
      monthKey: args.monthKey,
      totalIncome,
      totalExpenses,
      netChange,
      startingBalance,
      currentBalance,
      safeBalanceGoal,
      availableToSpend,
      currency: settings?.currency ?? "MAD",
      categoryTotals,
      topCategories: categoryTotals.slice(0, 3),
      largestExpense: largestExpense
        ? {
            id: largestExpense._id,
            amount: largestExpense.amount,
            category: categoryById.get(largestExpense.categoryId)?.name ?? "Other",
            occurredAt: new Date(largestExpense.occurredAt).toISOString(),
            ...(largestExpense.note ? { note: largestExpense.note } : {}),
          }
        : null,
    };
  },
});
