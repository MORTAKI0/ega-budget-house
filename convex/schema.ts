import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    kind: v.union(
      v.literal("expense"),
      v.literal("income"),
      v.literal("both"),
    ),
    sortOrder: v.number(),
    isDefault: v.boolean(),
  }).index("by_sortOrder", ["sortOrder"]),

  transactions: defineTable({
    amount: v.number(),
    type: v.union(v.literal("expense"), v.literal("income")),
    categoryId: v.id("categories"),
    note: v.optional(v.string()),
    occurredAt: v.number(),
    monthKey: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_monthKey", ["monthKey"])
    .index("by_occurredAt", ["occurredAt"])
    .index("by_monthKey_occurredAt", ["monthKey", "occurredAt"]),

  monthlySettings: defineTable({
    monthKey: v.string(),
    startingBalance: v.number(),
    safeBalanceGoal: v.number(),
    currency: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_monthKey", ["monthKey"]),
});
