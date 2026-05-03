import { type Id } from "./_generated/dataModel";
import { type QueryCtx } from "./_generated/server";

export const CATEGORY_ORDER = [
  "Transport",
  "WiFi",
  "Abonnement",
  "Home Stuff",
  "Coffee Outside",
  "Food",
  "Income",
  "Other",
] as const;

export type CategoryName = (typeof CATEGORY_ORDER)[number];
export type TransactionType = "expense" | "income";

export const INCOME_CATEGORY = "Income" satisfies CategoryName;

export const EXPENSE_CATEGORIES = [
  "Transport",
  "WiFi",
  "Abonnement",
  "Home Stuff",
  "Coffee Outside",
  "Food",
  "Other",
] as const satisfies readonly Exclude<CategoryName, typeof INCOME_CATEGORY>[];

export const DEFAULT_CATEGORY_DEFINITIONS = CATEGORY_ORDER.map((name, index) => ({
  name,
  kind: name === INCOME_CATEGORY ? ("income" as const) : ("expense" as const),
  sortOrder: index + 1,
}));

export function getCategoriesForTransactionType(type: TransactionType): readonly CategoryName[] {
  return type === "income" ? [INCOME_CATEGORY] : EXPENSE_CATEGORIES;
}

export function resolveCategoryForTransactionType(
  type: TransactionType,
  categoryName: string | undefined,
): CategoryName {
  if (isValidCategoryForTransactionType(type, categoryName)) {
    return categoryName;
  }

  return type === "income" ? INCOME_CATEGORY : "Other";
}

export function isValidCategoryForTransactionType(
  type: TransactionType,
  categoryName: string | undefined,
): categoryName is CategoryName {
  if (!categoryName) {
    return false;
  }

  return getCategoriesForTransactionType(type).includes(categoryName as CategoryName);
}

export async function getResolvedCategoryId(
  ctx: QueryCtx,
  type: TransactionType,
  categoryId: Id<"categories">,
): Promise<Id<"categories">> {
  const requestedCategory = await ctx.db.get(categoryId);
  const fallbackName = resolveCategoryForTransactionType(type, requestedCategory?.name);

  if (requestedCategory?.name === fallbackName) {
    return categoryId;
  }

  const fallbackCategory = (await ctx.db.query("categories").collect()).find(
    (category) => category.name === fallbackName,
  );

  if (!fallbackCategory) {
    throw new Error(`Missing required category: ${fallbackName}.`);
  }

  return fallbackCategory._id;
}
