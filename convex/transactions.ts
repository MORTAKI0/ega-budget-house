import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getResolvedCategoryId } from "./categoryRules";

export const listByMonth = query({
  args: {
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_monthKey_occurredAt", (q) => q.eq("monthKey", args.monthKey))
      .order("desc")
      .collect();

    return await Promise.all(
      transactions.map(async (transaction) => {
        const category = await ctx.db.get(transaction.categoryId);

        return {
          ...transaction,
          category: category
            ? {
                _id: category._id,
                name: category.name,
                kind: category.kind,
              }
            : null,
        };
      }),
    );
  },
});

export const create = mutation({
  args: {
    amount: v.number(),
    type: v.union(v.literal("expense"), v.literal("income")),
    categoryId: v.id("categories"),
    note: v.optional(v.string()),
    occurredAt: v.number(),
    monthKey: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }

    const now = Date.now();
    const categoryId = await getResolvedCategoryId(ctx, args.type, args.categoryId);

    return await ctx.db.insert("transactions", {
      amount: args.amount,
      type: args.type,
      categoryId,
      note: args.note,
      occurredAt: args.occurredAt,
      monthKey: args.monthKey,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("transactions"),
    amount: v.optional(v.number()),
    type: v.optional(v.union(v.literal("expense"), v.literal("income"))),
    categoryId: v.optional(v.id("categories")),
    note: v.optional(v.string()),
    occurredAt: v.optional(v.number()),
    monthKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    const transaction = await ctx.db.get(id);

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    if (patch.amount !== undefined && patch.amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }

    const type = patch.type ?? transaction.type;
    const categoryId = await getResolvedCategoryId(
      ctx,
      type,
      patch.categoryId ?? transaction.categoryId,
    );

    await ctx.db.patch(id, {
      ...patch,
      categoryId,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
