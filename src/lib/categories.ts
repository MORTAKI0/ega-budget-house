export const defaultCategories = [
  "Transport",
  "WiFi",
  "Abonnement",
  "Home Stuff",
  "Coffee Outside",
  "Food",
  "Income",
  "Other",
] as const;

export type DefaultCategoryName = (typeof defaultCategories)[number];

export const expenseCategories: Exclude<DefaultCategoryName, "Income">[] = [
  "Transport",
  "WiFi",
  "Abonnement",
  "Home Stuff",
  "Coffee Outside",
  "Food",
  "Other",
];
