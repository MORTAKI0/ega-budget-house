import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("monthlySettings")
      .withIndex("by_monthKey", (q) => q.eq("monthKey", args.monthKey))
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
    const existing = await ctx.db
      .query("monthlySettings")
      .withIndex("by_monthKey", (q) => q.eq("monthKey", args.monthKey))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        startingBalance: args.startingBalance,
        safeBalanceGoal: args.safeBalanceGoal,
        currency: args.currency,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("monthlySettings", {
      monthKey: args.monthKey,
      startingBalance: args.startingBalance,
      safeBalanceGoal: args.safeBalanceGoal,
      currency: args.currency,
      createdAt: now,
      updatedAt: now,
    });
  },
});
