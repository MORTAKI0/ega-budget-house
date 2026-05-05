"use client";

import { useRef, useState } from "react";
import { CalendarDays, Check, PencilLine } from "lucide-react";

import { cn } from "@/lib/utils";

type TransactionType = "expense" | "income";

const categories = [
  { id: "transport", label: "Transport", emoji: "🚇" },
  { id: "wifi", label: "Wifi", emoji: "📶" },
  { id: "subscr", label: "Subscriptions", emoji: "📦" },
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "food", label: "Food", emoji: "🥗" },
  { id: "other", label: "Other", emoji: "✦" },
];

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("other");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const isExpense = type === "expense";
  const s = TOGGLE_STYLES[type];
  const numericAmount = parseFloat(amount);
  const display =
    Number.isFinite(numericAmount) && numericAmount > 0 ? numericAmount.toFixed(2) : "0.00";
  const canSave = parseFloat(display) > 0;
  const activeCategoryClasses = isExpense
    ? "border-rose-500/60 bg-rose-500/8"
    : "border-emerald-500/60 bg-emerald-500/8";
  const amountPrefix = isExpense ? "-" : "+";
  const saveLabel = canSave ? `Save ${amountPrefix}$${display}` : "Save entry";
  const categoryGridItems = [
    ...categories.filter((item) => item.id !== "other"),
    null,
    categories.find((item) => item.id === "other"),
    null,
  ];

  function handleSave() {
    if (!canSave) {
      return;
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-[420px] min-w-0 flex-col rounded-[2rem] bg-[#0a0a0f] pb-5 font-[var(--font-sora,ui-sans-serif)] text-[#f8fafc] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
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
              canSave ? s.text : "text-zinc-700",
            )}
          >
            {amountPrefix} ${display}
          </span>
          {!canSave ? (
            <span className="mt-3 text-xs text-zinc-600">Tap to enter amount</span>
          ) : null}
        </button>
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
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
                onClick={() => setType(item)}
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

            const active = category === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900 py-4 transition-all duration-150 hover:border-zinc-700 active:scale-95",
                  active && activeCategoryClasses,
                )}
              >
                <span className="text-2xl leading-none">{item.emoji}</span>
                <span className="text-[11px] leading-none font-medium text-zinc-300 capitalize">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 px-6 pt-1">
        <div className="rounded-xl bg-zinc-900/40 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <CalendarDays className={cn("size-4", s.text)} />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-right font-medium text-zinc-300">Today · May 05</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-zinc-900/40 px-4 py-3">
          <div className="flex gap-2">
            <PencilLine className={cn("mt-2 size-3.5 shrink-0", s.text)} />
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add note"
              rows={3}
              className="max-h-20 min-h-20 w-full resize-none border-0 bg-transparent text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          "mx-6 mt-5 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r py-5 text-base font-semibold text-white transition-transform duration-150",
          s.gradient,
          s.glow,
          canSave ? "active:scale-95" : "cursor-not-allowed opacity-50",
        )}
      >
        {saved ? <Check className="size-5" /> : null}
        {saved ? "Saved" : saveLabel}
      </button>
    </section>
  );
}
