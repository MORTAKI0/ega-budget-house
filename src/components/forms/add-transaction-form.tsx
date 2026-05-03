"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { ArrowDownCircle, ArrowUpCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  getCategoriesForTransactionType,
  isValidCategoryForTransactionType,
  resolveCategoryForTransactionType,
  type CategoryName,
} from "@/lib/categories";
import { getMonthKey } from "@/lib/dates";
import {
  addTransactionSchema,
  getDateInputTimestamp,
  getTodayInputValue,
  type AddTransactionInput,
} from "@/lib/transactions";
import { cn } from "@/lib/utils";

type TransactionType = AddTransactionInput["type"];
type FormErrors = Partial<Record<keyof AddTransactionInput, string>>;

export function AddTransactionForm() {
  const categories = useQuery(api.categories.list, {});
  const createTransaction = useMutation(api.transactions.create);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(() => getTodayInputValue());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const categoryByName = useMemo(
    () => new Map(categories?.map((category) => [category.name, category]) ?? []),
    [categories],
  );

  const visibleCategoryNames = getCategoriesForTransactionType(type);
  const visibleCategories = visibleCategoryNames
    .map((categoryName) => categoryByName.get(categoryName))
    .filter((category) => category !== undefined);

  const defaultExpenseCategoryId = categoryByName.get("Other" satisfies CategoryName)?._id ?? "";
  const effectiveCategoryId = categoryId || (type === "expense" ? defaultExpenseCategoryId : "");
  const selectedCategory = categories?.find((category) => category._id === effectiveCategoryId);
  const selectedCategoryId = selectedCategory?._id ?? "";

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  function updateType(nextType: TransactionType) {
    const nextCategoryName = resolveCategoryForTransactionType(
      nextType,
      categories?.find((category) => category._id === categoryId)?.name,
    );

    setType(nextType);
    setCategoryId(categoryByName.get(nextCategoryName)?._id ?? "");
    setErrors((current) => ({ ...current, type: undefined, categoryId: undefined }));
  }

  function updateAmount(nextAmount: string) {
    setAmount(nextAmount);
    setErrors((current) => ({ ...current, amount: undefined }));
  }

  function updateCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setErrors((current) => ({ ...current, categoryId: undefined }));
  }

  function updateDate(nextDate: string) {
    setDate(nextDate);
    setErrors((current) => ({ ...current, date: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = addTransactionSchema.safeParse({
      amount,
      type,
      categoryId: selectedCategoryId,
      date,
      note,
    });

    const nextErrors: FormErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof AddTransactionInput | undefined;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
    }

    if (
      selectedCategory &&
      !isValidCategoryForTransactionType(type, selectedCategory.name)
    ) {
      nextErrors.categoryId =
        type === "income"
          ? "Income must use Income category."
          : "Expense cannot use Income category.";
    }

    if (Object.keys(nextErrors).length > 0 || !parsed.success) {
      setErrors(nextErrors);
      return;
    }

    const occurredAt = getDateInputTimestamp(parsed.data.date);

    if (Number.isNaN(occurredAt)) {
      setErrors((current) => ({ ...current, date: "Choose a valid date." }));
      return;
    }

    setIsSaving(true);

    try {
      await createTransaction({
        amount: parsed.data.amount,
        type: parsed.data.type,
        categoryId: parsed.data.categoryId as Id<"categories">,
        note: parsed.data.note ? parsed.data.note : undefined,
        occurredAt,
        monthKey: getMonthKey(new Date(occurredAt)),
      });

      toast.success("Transaction added");
      setAmount("");
      setType("expense");
      setCategoryId(categoryByName.get("Other" satisfies CategoryName)?._id ?? "");
      setDate(getTodayInputValue());
      setNote("");
      setErrors({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save transaction.");
    } finally {
      setIsSaving(false);
    }
  }

  if (categories === undefined) {
    return (
      <Card className="mt-6 border-emerald-100 shadow-sm">
        <CardContent className="flex min-h-48 items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Loader2 className="size-4 animate-spin" />
            Loading categories
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <form onSubmit={handleSubmit} className="mt-6 flex min-w-0 flex-1 flex-col gap-5">
        <Card className="border-emerald-100 bg-white shadow-sm">
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                ref={amountInputRef}
                autoFocus
                inputMode="decimal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => updateAmount(event.target.value)}
                disabled={isSaving}
                aria-invalid={Boolean(errors.amount)}
                className="h-16 rounded-xl border-emerald-100 bg-emerald-50/60 px-4 text-3xl font-semibold text-emerald-950 shadow-inner placeholder:text-emerald-900/30 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 md:text-3xl"
              />
              {errors.amount ? (
                <p className="text-sm font-medium text-red-600">{errors.amount}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-emerald-50 p-1">
              <Button
                type="button"
                variant={type === "expense" ? "default" : "ghost"}
                className={cn(
                  "h-12 rounded-lg",
                  type === "expense"
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "text-emerald-900 hover:bg-white",
                )}
                onClick={() => updateType("expense")}
                disabled={isSaving}
              >
                <ArrowDownCircle />
                Expense
              </Button>
              <Button
                type="button"
                variant={type === "income" ? "default" : "ghost"}
                className={cn(
                  "h-12 rounded-lg",
                  type === "income"
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "text-emerald-900 hover:bg-white",
                )}
                onClick={() => updateType("income")}
                disabled={isSaving}
              >
                <ArrowUpCircle />
                Income
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              {visibleCategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {visibleCategories.map((category) => (
                    <Button
                      key={category._id}
                      type="button"
                      variant={selectedCategoryId === category._id ? "default" : "outline"}
                      className={cn(
                        "h-11 justify-start rounded-xl px-3 text-left",
                        selectedCategoryId === category._id
                          ? "bg-emerald-700 text-white hover:bg-emerald-800"
                          : "border-emerald-100 bg-white text-zinc-800 hover:bg-emerald-50",
                      )}
                      onClick={() => updateCategory(category._id)}
                      disabled={isSaving}
                    >
                      <span className="min-w-0 truncate">{category.name}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  No matching categories found.
                </div>
              )}
              {errors.categoryId ? (
                <p className="text-sm font-medium text-red-600">{errors.categoryId}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(event) => updateDate(event.target.value)}
                disabled={isSaving}
                aria-invalid={Boolean(errors.date)}
                className="h-12 rounded-xl border-emerald-100 bg-white px-3 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
              />
              {errors.date ? (
                <p className="text-sm font-medium text-red-600">{errors.date}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Optional note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={isSaving}
                className="min-h-24 resize-none rounded-xl border-emerald-100 bg-white focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-20 z-10 rounded-2xl bg-zinc-50/95 pt-1 pb-2 backdrop-blur">
          <Button
            type="submit"
            disabled={isSaving || visibleCategories.length === 0 || !selectedCategoryId}
            className="h-13 w-full rounded-xl bg-emerald-700 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            {isSaving ? "Saving" : "Save transaction"}
          </Button>
        </div>
      </form>
    </>
  );
}
