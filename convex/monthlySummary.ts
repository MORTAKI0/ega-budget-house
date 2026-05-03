import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_monthKey", (q) => q.eq("monthKey", args.monthKey))
      .collect();

    const settings = await ctx.db
      .query("monthlySettings")
      .withIndex("by_monthKey", (q) => q.eq("monthKey", args.monthKey))
      .unique();

    const categories = await ctx.db.query("categories").collect();
    const categoryById = new Map(categories.map((category) => [category._id, category]));

    const monthlyIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const monthlyExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const startingBalance = settings?.startingBalance ?? 0;
    const safeBalanceGoal = settings?.safeBalanceGoal ?? 0;
    const currentBalance = startingBalance + monthlyIncome - monthlyExpenses;
    const availableToSpend = currentBalance - safeBalanceGoal;

    const categoryTotals = new Map<string, number>();

    for (const transaction of transactions) {
      if (transaction.type !== "expense") continue;

      const category = categoryById.get(transaction.categoryId);
      const categoryName = category?.name ?? "Unknown";

      categoryTotals.set(
        categoryName,
        (categoryTotals.get(categoryName) ?? 0) + transaction.amount,
      );
    }

    const topCategories = Array.from(categoryTotals.entries())
      .map(([categoryName, total]) => ({ categoryName, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const biggestExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];

    return {
      monthKey: args.monthKey,
      monthlyIncome,
      monthlyExpenses,
      netChange: monthlyIncome - monthlyExpenses,
      startingBalance,
      safeBalanceGoal,
      currentBalance,
      availableToSpend,
      topCategories,
      biggestExpense,
    };
  },
});
