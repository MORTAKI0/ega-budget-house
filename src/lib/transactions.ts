import { z } from "zod";

export const transactionTypeSchema = z.enum(["expense", "income"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const addTransactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  type: transactionTypeSchema,
  categoryId: z.string().min(1, "Choose a category."),
  date: z.string().min(1, "Choose a date."),
  note: z.string().trim().optional(),
});

export type AddTransactionInput = z.infer<typeof addTransactionSchema>;

export function getTodayInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateInputTimestamp(dateValue: string): number {
  return new Date(`${dateValue}T00:00:00`).getTime();
}
