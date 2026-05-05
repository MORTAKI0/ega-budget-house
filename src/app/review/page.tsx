import { AppShell } from "@/components/app-shell/app-shell";
import { MonthlyTransactionList } from "@/components/review/monthly-transaction-list";

export default function ReviewPage() {
  return (
    <AppShell>
      <header className="mx-auto w-full max-w-[420px] font-[var(--font-sora,inherit)]">
        <h1 className="text-3xl font-bold tracking-normal text-[#f8fafc]">Review</h1>
        <p className="mt-1 text-sm text-zinc-500">Check saved transactions by month.</p>
      </header>
      <MonthlyTransactionList />
    </AppShell>
  );
}
