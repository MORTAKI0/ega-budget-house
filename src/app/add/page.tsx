// src/app/add/page.tsx
import { AppShell } from "@/components/app-shell/app-shell";
import { AddTransactionForm } from "@/components/forms/add-transaction-form";

export default function AddPage() {
  return (
    <AppShell>
      <header className="mx-auto w-full max-w-[420px] font-[var(--font-sora,inherit)]">
        <h1 className="text-3xl font-bold tracking-normal text-[#f8fafc]">Add</h1>
      </header>
      <AddTransactionForm />
    </AppShell>
  );
}
