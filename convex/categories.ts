import { mutation, query } from "./_generated/server";

const defaultCategories = [
  { name: "Transport", kind: "expense", sortOrder: 1 },
  { name: "WiFi", kind: "expense", sortOrder: 2 },
  { name: "Abonnement", kind: "expense", sortOrder: 3 },
  { name: "Home Stuff", kind: "expense", sortOrder: 4 },
  { name: "Coffee Outside", kind: "expense", sortOrder: 5 },
  { name: "Food", kind: "expense", sortOrder: 6 },
  { name: "Income", kind: "income", sortOrder: 7 },
  { name: "Other", kind: "expense", sortOrder: 8 },
] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").withIndex("by_sortOrder").collect();
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();

    if (existing.length > 0) {
      return {
        inserted: 0,
        skipped: true,
      };
    }

    for (const category of defaultCategories) {
      await ctx.db.insert("categories", {
        name: category.name,
        kind: category.kind,
        sortOrder: category.sortOrder,
        isDefault: true,
      });
    }

    return {
      inserted: defaultCategories.length,
      skipped: false,
    };
  },
});
