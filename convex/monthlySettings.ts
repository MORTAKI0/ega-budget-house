import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

const monthKeyPattern = /^\d{4}-\d{2}$/;

function validateSettingsInput(args: {
  monthKey: string;
  startingBalance: number;
  safeBalanceGoal: number;
  currency: string;
}) {
  if (!monthKeyPattern.test(args.monthKey)) {
    throw new Error("Month must use YYYY-MM format.");
  }

  if (!Number.isFinite(args.startingBalance)) {
    throw new Error("Starting balance must be a valid number.");
  }

  if (!Number.isFinite(args.safeBalanceGoal)) {
    throw new Error("Safe balance goal must be a valid number.");
  }

  if (!args.currency.trim()) {
    throw new Error("Currency is required.");
  }
}

export const get = query({
  args: {
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("monthlySettings")
      .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("monthKey", args.monthKey))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    monthKey: v.string(),
    startingBalance: v.number(),
    safeBalanceGoal: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    validateSettingsInput(args);

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Sign in to save monthly settings.");
    }

    const currency = args.currency.trim().toUpperCase();

    const existing = await ctx.db
      .query("monthlySettings")
      .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("monthKey", args.monthKey))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        startingBalance: args.startingBalance,
        safeBalanceGoal: args.safeBalanceGoal,
        currency,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("monthlySettings", {
      userId,
      monthKey: args.monthKey,
      startingBalance: args.startingBalance,
      safeBalanceGoal: args.safeBalanceGoal,
      currency,
      createdAt: now,
      updatedAt: now,
    });
  },
});
