"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_CURRENCY } from "@/lib/currency";
import { getMonthKey } from "@/lib/dates";

type FormErrors = Partial<{
  monthKey: string;
  startingBalance: string;
  safeBalanceGoal: string;
  currency: string;
  form: string;
}>;

type MonthlySettings = NonNullable<
  ReturnType<typeof useQuery<typeof api.monthlySettings.get>>
>;

function parseRequiredNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function MonthlySettingsForm() {
  const [monthKey, setMonthKey] = useState(() => getMonthKey());
  const settings = useQuery(api.monthlySettings.get, { monthKey });

  if (settings === undefined) {
    return <MonthlySettingsLoading monthKey={monthKey} onMonthChange={setMonthKey} />;
  }

  return (
    <MonthlySettingsFormContent
      key={monthKey}
      monthKey={monthKey}
      settings={settings}
      onMonthChange={setMonthKey}
    />
  );
}

function MonthlySettingsFormContent({
  monthKey,
  settings,
  onMonthChange,
}: {
  monthKey: string;
  settings: MonthlySettings | null;
  onMonthChange: (monthKey: string) => void;
}) {
  const upsertSettings = useMutation(api.monthlySettings.upsert);

  const [startingBalance, setStartingBalance] = useState(
    settings ? String(settings.startingBalance) : "",
  );
  const [safeBalanceGoal, setSafeBalanceGoal] = useState(
    settings ? String(settings.safeBalanceGoal) : "",
  );
  const [currency, setCurrency] = useState(settings?.currency || DEFAULT_CURRENCY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  function validate() {
    const nextErrors: FormErrors = {};
    const parsedStartingBalance = parseRequiredNumber(startingBalance);
    const parsedSafeBalanceGoal = parseRequiredNumber(safeBalanceGoal);
    const normalizedCurrency = currency.trim().toUpperCase();

    if (!/^\d{4}-\d{2}$/.test(monthKey)) {
      nextErrors.monthKey = "Choose a valid month.";
    }

    if (parsedStartingBalance === null) {
      nextErrors.startingBalance = "Enter a valid starting balance.";
    }

    if (parsedSafeBalanceGoal === null) {
      nextErrors.safeBalanceGoal = "Enter a valid safe balance goal.";
    }

    if (!normalizedCurrency) {
      nextErrors.currency = "Currency is required.";
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0 ||
      parsedStartingBalance === null ||
      parsedSafeBalanceGoal === null
    ) {
      return null;
    }

    return {
      startingBalance: parsedStartingBalance,
      safeBalanceGoal: parsedSafeBalanceGoal,
      currency: normalizedCurrency,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const parsed = validate();

    if (!parsed) {
      return;
    }

    setIsSaving(true);

    try {
      await upsertSettings({
        monthKey,
        startingBalance: parsed.startingBalance,
        safeBalanceGoal: parsed.safeBalanceGoal,
        currency: parsed.currency,
      });
      setCurrency(parsed.currency);
      setStatus("success");
      setErrors({});
    } catch (error) {
      setStatus("error");
      setErrors({
        form: error instanceof Error ? error.message : "Could not save settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex min-w-0 flex-1 flex-col gap-5">
      <Card className="border-emerald-100 bg-white shadow-sm">
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="settings-month">Month</Label>
            <Input
              id="settings-month"
              type="month"
              value={monthKey}
              onChange={(event) => onMonthChange(event.target.value)}
              disabled={isSaving}
              aria-invalid={Boolean(errors.monthKey)}
              className="h-12 rounded-xl border-emerald-100 bg-white px-3 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
            />
            {errors.monthKey ? (
              <p className="text-sm font-medium text-red-600">{errors.monthKey}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="starting-balance">Starting balance</Label>
              <Input
                id="starting-balance"
                inputMode="decimal"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={startingBalance}
                onChange={(event) => {
                  setStartingBalance(event.target.value);
                  setErrors((current) => ({ ...current, startingBalance: undefined }));
                  setStatus(null);
                }}
                disabled={isSaving}
                aria-invalid={Boolean(errors.startingBalance)}
                className="h-12 rounded-xl border-emerald-100 bg-emerald-50/60 px-3 text-lg font-semibold text-emerald-950 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
              />
              {errors.startingBalance ? (
                <p className="text-sm font-medium text-red-600">{errors.startingBalance}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="safe-balance-goal">Safe balance goal</Label>
              <Input
                id="safe-balance-goal"
                inputMode="decimal"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={safeBalanceGoal}
                onChange={(event) => {
                  setSafeBalanceGoal(event.target.value);
                  setErrors((current) => ({ ...current, safeBalanceGoal: undefined }));
                  setStatus(null);
                }}
                disabled={isSaving}
                aria-invalid={Boolean(errors.safeBalanceGoal)}
                className="h-12 rounded-xl border-emerald-100 bg-emerald-50/60 px-3 text-lg font-semibold text-emerald-950 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
              />
              {errors.safeBalanceGoal ? (
                <p className="text-sm font-medium text-red-600">{errors.safeBalanceGoal}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(event) => {
                setCurrency(event.target.value.toUpperCase());
                setErrors((current) => ({ ...current, currency: undefined }));
                setStatus(null);
              }}
              disabled={isSaving}
              aria-invalid={Boolean(errors.currency)}
              maxLength={8}
              className="h-12 rounded-xl border-emerald-100 bg-white px-3 font-semibold uppercase focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
            />
            {errors.currency ? (
              <p className="text-sm font-medium text-red-600">{errors.currency}</p>
            ) : null}
          </div>

          {status === "success" ? (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              Settings saved for {monthKey}.
            </div>
          ) : null}

          {errors.form ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {errors.form}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="sticky bottom-20 z-10 rounded-2xl bg-zinc-50/95 pt-1 pb-2 backdrop-blur">
        <Button
          type="submit"
          disabled={isSaving}
          className="h-13 w-full rounded-xl bg-emerald-700 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          {isSaving ? "Saving" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

function MonthlySettingsLoading({
  monthKey,
  onMonthChange,
}: {
  monthKey: string;
  onMonthChange: (monthKey: string) => void;
}) {
  return (
    <section className="mt-6 flex min-w-0 flex-1 flex-col gap-5">
      <Card className="border-emerald-100 bg-white shadow-sm">
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="settings-month">Month</Label>
            <Input
              id="settings-month"
              type="month"
              value={monthKey}
              onChange={(event) => onMonthChange(event.target.value)}
              className="h-12 rounded-xl border-emerald-100 bg-white px-3 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
            />
          </div>
          <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-800">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading settings
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
