"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, CalendarDays, Check, Loader2, PencilLine } from "lucide-react";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
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
type FormErrors = Partial<Record<keyof AddTransactionInput | "form", string>>;

const CATEGORY_META: Record<CategoryName, { label: string; emoji: string }> = {
  Transport: { label: "Transport", emoji: "🚇" },
  WiFi: { label: "WiFi", emoji: "📶" },
  Abonnement: { label: "Abonnement", emoji: "📦" },
  "Home Stuff": { label: "Home", emoji: "🏠" },
  "Coffee Outside": { label: "Coffee", emoji: "☕" },
  Food: { label: "Food", emoji: "🥗" },
  Income: { label: "Income", emoji: "$" },
  Other: { label: "Other", emoji: "✦" },
};

const TOGGLE_STYLES = {
  expense: {
    gradient: "from-rose-500 to-orange-400",
    glow: "shadow-[0_0_24px_rgba(244,63,94,0.35)]",
    text: "text-rose-400",
  },
  income: {
    gradient: "from-lime-400 to-emerald-500",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.35)]",
    text: "text-emerald-400",
  },
};

export function AddTransactionForm() {
  const categories = useQuery(api.categories.list, {});
  const createTransaction = useMutation(api.transactions.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => getTodayInputValue());
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const categoryByName = useMemo(
    () => new Map(categories?.map((category) => [category.name, category]) ?? []),
    [categories],
  );
  const visibleCategories = getCategoriesForTransactionType(type)
    .map((categoryName) => categoryByName.get(categoryName))
    .filter((category) => category !== undefined);
  const defaultExpenseCategoryId = categoryByName.get("Other" satisfies CategoryName)?._id ?? "";
  const effectiveCategoryId = categoryId || (type === "expense" ? defaultExpenseCategoryId : "");
  const selectedCategory = categories?.find((category) => category._id === effectiveCategoryId);
  const selectedCategoryId = selectedCategory?._id ?? "";

  const isExpense = type === "expense";
  const s = TOGGLE_STYLES[type];
  const numericAmount = parseFloat(amount);
  const display =
    Number.isFinite(numericAmount) && numericAmount > 0 ? numericAmount.toFixed(2) : "0.00";
  const canSave = numericAmount > 0 && Boolean(selectedCategoryId) && !isSaving;
  const activeCategoryClasses = isExpense
    ? "border-rose-500/60 bg-rose-500/8"
    : "border-emerald-500/60 bg-emerald-500/8";
  const amountPrefix = isExpense ? "-" : "+";
  const saveLabel = canSave ? `Save ${amountPrefix}$${display}` : "Save entry";
  const categoryGridItems =
    type === "expense"
      ? [
          ...visibleCategories.filter((item) => item.name !== "Other"),
          null,
          visibleCategories.find((item) => item.name === "Other"),
          null,
        ]
      : visibleCategories;
  const selectedDateLabel = date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
      }).format(new Date(`${date}T00:00:00`))
    : "Choose date";

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        window.clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  function updateType(nextType: TransactionType) {
    const currentCategoryName = categories?.find((category) => category._id === categoryId)?.name;
    const nextCategoryName = resolveCategoryForTransactionType(nextType, currentCategoryName);

    setType(nextType);
    setCategoryId(categoryByName.get(nextCategoryName)?._id ?? "");
    setErrors((current) => ({
      ...current,
      type: undefined,
      categoryId: undefined,
      form: undefined,
    }));
    setSaved(false);
  }

  function updateAmount(nextAmount: string) {
    setAmount(nextAmount);
    setErrors((current) => ({ ...current, amount: undefined, form: undefined }));
    setSaved(false);
  }

  function updateCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setErrors((current) => ({ ...current, categoryId: undefined, form: undefined }));
    setSaved(false);
  }

  function markSaved() {
    setSaved(true);

    if (savedTimeoutRef.current) {
      window.clearTimeout(savedTimeoutRef.current);
    }

    savedTimeoutRef.current = window.setTimeout(() => {
      setSaved(false);
      savedTimeoutRef.current = null;
    }, 2000);
  }

  async function handleSave() {
    if (isSaving) {
      return;
    }

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

    if (selectedCategory && !isValidCategoryForTransactionType(type, selectedCategory.name)) {
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
    setErrors({});

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
      setCategoryId("");
      setDate(getTodayInputValue());
      setNote("");
      markSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save transaction.";
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (categories === undefined) {
    return (
      <section className="mx-auto mt-6 flex min-h-48 w-full max-w-[420px] items-center justify-center rounded-[2rem] bg-[#0a0a0f] font-[var(--font-sora,ui-sans-serif)] text-[#f8fafc] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Loader2 className="size-4 animate-spin" />
          Loading categories
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-[420px] min-w-0 flex-col rounded-[2rem] bg-[#0a0a0f] pb-5 font-[var(--font-sora,ui-sans-serif)] text-[#f8fafc] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <Toaster richColors position="top-center" />
      <div
        className="rounded-[2rem] px-6 pt-8 pb-2"
        style={{
          background: isExpense
            ? "radial-gradient(ellipse at top, rgba(244,63,94,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse at top, rgba(52,211,153,0.06) 0%, transparent 70%)",
        }}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="flex w-full flex-col items-center rounded-3xl px-4 py-5 text-center transition active:scale-[0.99]"
        >
          <span
            className={cn(
              "text-5xl leading-none font-light tracking-tight tabular-nums",
              numericAmount > 0 ? s.text : "text-zinc-700",
            )}
          >
            {amountPrefix} ${display}
          </span>
          {numericAmount > 0 ? null : (
            <span className="mt-3 text-xs text-zinc-600">Tap to enter amount</span>
          )}
        </button>
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => updateAmount(event.target.value)}
          disabled={isSaving}
          className="sr-only"
          aria-label="Amount"
        />
      </div>

      <div className="mt-5">
        <div className="relative mx-6 flex gap-1 rounded-2xl bg-zinc-900 p-1">
          <span
            className={cn(
              "absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-xl bg-gradient-to-r transition-transform duration-300 ease-out",
              s.gradient,
              s.glow,
              isExpense ? "translate-x-0" : "translate-x-[calc(100%+0.25rem)]",
            )}
          />
          {(["expense", "income"] as const).map((item) => {
            const active = type === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => updateType(item)}
                disabled={isSaving}
                className={cn(
                  "relative z-10 flex-1 rounded-xl py-3.5 text-sm font-semibold capitalize transition-colors duration-300",
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 px-6">
        <h2 className="mb-3 text-xs font-medium text-zinc-500">Pick a category</h2>
        <div className="grid grid-cols-3 gap-2">
          {categoryGridItems.map((item, index) => {
            if (!item) {
              return (
                <div
                  key={`spacer-${index}`}
                  className="pointer-events-none invisible"
                  aria-hidden="true"
                />
              );
            }

            const meta = CATEGORY_META[item.name as CategoryName];
            const active = selectedCategoryId === item._id;

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => updateCategory(item._id)}
                disabled={isSaving}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900 py-4 transition-all duration-150 hover:border-zinc-700 active:scale-95",
                  active && activeCategoryClasses,
                )}
              >
                <span className="text-2xl leading-none">{meta?.emoji ?? "✦"}</span>
                <span className="text-[11px] leading-none font-medium text-zinc-300 capitalize">
                  {meta?.label ?? item.name}
                </span>
              </button>
            );
          })}
        </div>
        {errors.categoryId ? (
          <p className="mt-2 text-xs font-medium text-rose-400">{errors.categoryId}</p>
        ) : null}
      </div>

      <div className="mt-6 px-6 pt-1">
        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus()}
          disabled={isSaving}
          className="w-full rounded-xl bg-zinc-900/40 px-4 py-3 text-left transition hover:bg-zinc-900/70 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <CalendarDays className={cn("size-4", s.text)} />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-right font-medium text-zinc-300">{selectedDateLabel}</p>
          </div>
        </button>
        <input
          ref={dateInputRef}
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setErrors((current) => ({ ...current, date: undefined, form: undefined }));
            setSaved(false);
          }}
          disabled={isSaving}
          className="sr-only"
          aria-label="Transaction date"
        />
        {errors.date ? (
          <p className="mt-2 text-xs font-medium text-rose-400">{errors.date}</p>
        ) : null}

        <div className="mt-3 rounded-xl bg-zinc-900/40 px-4 py-3">
          <div className="flex gap-2">
            <PencilLine className={cn("mt-2 size-3.5 shrink-0", s.text)} />
            <textarea
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setErrors((current) => ({ ...current, form: undefined }));
                setSaved(false);
              }}
              placeholder="Add note"
              rows={3}
              disabled={isSaving}
              className="max-h-20 min-h-20 w-full resize-none border-0 bg-transparent text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      {errors.amount || errors.form ? (
        <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errors.amount ?? errors.form}</span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className={cn(
          "mx-6 mt-5 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r py-5 text-base font-semibold text-white transition-transform duration-150",
          s.gradient,
          s.glow,
          canSave ? "active:scale-95" : "cursor-not-allowed opacity-50",
        )}
      >
        {isSaving ? (
          <Loader2 className="size-5 animate-spin" />
        ) : saved ? (
          <Check className="size-5" />
        ) : null}
        {isSaving ? "Saving..." : saved ? "Saved" : saveLabel}
      </button>
    </section>
  );
}
