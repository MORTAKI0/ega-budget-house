"use client";

import { useState } from "react";
import { CalendarDays, Check, PencilLine } from "lucide-react";

import { cn } from "@/lib/utils";

type TransactionType = "expense" | "income";

const categories = [
  { id: "transport", label: "transport", emoji: "🚇" },
  { id: "wifi", label: "wifi", emoji: "📶" },
  { id: "subscr", label: "subscr", emoji: "📦" },
  { id: "home", label: "home", emoji: "🏠" },
  { id: "coffee", label: "coffee", emoji: "☕" },
  { id: "food", label: "food", emoji: "🥗" },
  { id: "other", label: "other", emoji: "✦" },
];

const TOGGLE_STYLES = {
  expense: {
    gradient: "from-rose-500 to-orange-400",
    glow: "shadow-[0_0_24px_rgba(244,63,94,0.35)]",
    text: "text-rose-400",
    border: "border-rose-500/40",
    ring: "ring-rose-500/20",
  },
  income: {
    gradient: "from-lime-400 to-emerald-500",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.35)]",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    ring: "ring-emerald-500/20",
  },
};

export function AddTransactionForm() {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("other");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const isExpense = type === "expense";
  const s = TOGGLE_STYLES[type];
  const amountDisplay = amount || "0.00";
  const canSave = amount.trim() !== "" && parseFloat(amount) > 0;

  function handleSave() {
    if (!canSave) {
      return;
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-[420px] min-w-0 flex-col rounded-[2rem] border border-zinc-900/90 bg-[#0a0a0f] pb-5 font-[var(--font-sora,ui-sans-serif)] text-[#f8fafc] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="border-b border-zinc-800/60 px-6 pt-10 pb-5">
        <div
          className={cn(
            "bg-[#0a0a0f] p-0 transition-shadow duration-300",
            isExpense
              ? "shadow-[0_0_64px_rgba(244,63,94,0.18)]"
              : "shadow-[0_0_64px_rgba(52,211,153,0.18)]",
          )}
        >
          <p className="mb-1 text-xs font-medium tracking-[0.22em] text-zinc-500 uppercase">
            Amount
          </p>
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <div className="flex min-w-0 items-baseline gap-1">
            <span className="text-4xl font-light text-zinc-400">$</span>
            <input
              id="amount"
              inputMode="decimal"
              type="number"
              min="0"
              step="0.01"
              placeholder={amountDisplay}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className={cn(
                "min-w-0 flex-1 [appearance:textfield] bg-transparent text-[clamp(56px,17vw,80px)] leading-none font-extralight tracking-normal tabular-nums outline-none placeholder:text-zinc-700 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                amount ? s.text : "text-zinc-700",
              )}
            />
            <span
              className={cn("h-15 w-0.5 animate-pulse rounded-full bg-gradient-to-b", s.gradient)}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-800/60 pb-5">
        <p className="px-6 pt-5 pb-3 text-[10px] font-medium tracking-[0.15em] text-zinc-600 uppercase">
          Type
        </p>
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
                  "relative z-10 flex-1 rounded-xl py-3 text-sm font-semibold capitalize transition-colors duration-300",
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-zinc-800/60 px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[10px] font-medium tracking-[0.15em] text-zinc-600 uppercase">
            Category
          </h2>
          <span className={cn("text-xs font-medium", s.text)}>Select one</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((item) => {
            const active = category === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  item.id === "other" && "col-span-3",
                  "rounded-2xl p-px transition-all duration-200",
                  active ? cn("bg-gradient-to-br", s.gradient, s.glow) : "bg-zinc-800",
                )}
              >
                <button
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "flex w-full flex-col items-center justify-center gap-1.5 rounded-[calc(1rem-1px)] border py-4 transition-all duration-200",
                    active
                      ? "scale-[0.97] border-transparent bg-zinc-950/90"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700",
                  )}
                >
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <span className="text-[11px] leading-none font-medium text-zinc-300">
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-b border-zinc-800/60 px-6 py-5">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-500">
            <CalendarDays className={cn("size-4", s.text)} />
            <span className="font-medium">Date</span>
          </div>
          <p className="text-right font-medium text-zinc-300">Today · May 05</p>
        </div>

        <div className="mt-4">
          <label
            htmlFor="note"
            className="mb-1 flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] text-zinc-600 uppercase"
          >
            <PencilLine className={cn("size-3.5", s.text)} />
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add context..."
            rows={3}
            className="max-h-20 min-h-20 w-full resize-none border-0 bg-transparent text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          "mx-6 mt-5 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r py-5 text-base font-bold text-white transition-transform duration-150",
          s.gradient,
          s.glow,
          canSave ? "active:scale-95" : "cursor-not-allowed opacity-50",
        )}
      >
        {saved ? <Check className="size-5" /> : null}
        {saved ? "Saved" : "Save entry"}
      </button>
    </section>
  );
}
