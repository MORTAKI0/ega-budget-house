// src/app/add/page.tsx
import { AppShell } from "@/components/app-shell/app-shell";
import { AddTransactionForm } from "@/components/forms/add-transaction-form";

export default function AddPage() {
  return (
    <AppShell>
      <header className="mx-auto w-full max-w-[420px] font-[var(--font-sora,inherit)]">
        <h1 className="text-3xl font-semibold tracking-normal text-[#f8fafc]">New entry</h1>
        <p className="mt-1 text-sm font-medium text-[#475569]">Record a transaction</p>
      </header>
      <AddTransactionForm />
    </AppShell>
  );
}
