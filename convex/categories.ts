import { mutation, query } from "./_generated/server";
import { DEFAULT_CATEGORY_DEFINITIONS } from "./categoryRules";

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
    const existingByName = new Map(existing.map((category) => [category.name, category]));
    let inserted = 0;

    for (const category of DEFAULT_CATEGORY_DEFINITIONS) {
      const current = existingByName.get(category.name);

      if (current) {
        if (
          current.kind !== category.kind ||
          current.sortOrder !== category.sortOrder ||
          !current.isDefault
        ) {
          await ctx.db.patch(current._id, {
            kind: category.kind,
            sortOrder: category.sortOrder,
            isDefault: true,
          });
        }

        continue;
      }

      await ctx.db.insert("categories", {
        name: category.name,
        kind: category.kind,
        sortOrder: category.sortOrder,
        isDefault: true,
      });
      inserted += 1;
    }

    return {
      inserted,
      skipped: inserted === 0,
    };
  },
});
