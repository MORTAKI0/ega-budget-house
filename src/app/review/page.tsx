import { AppShell } from "@/components/app-shell/app-shell";
import { PageHeader } from "@/components/app-shell/page-header";
import { MonthlyTransactionList } from "@/components/review/monthly-transaction-list";

export default function ReviewPage() {
  return (
    <AppShell>
      <PageHeader title="Review" description="Check saved transactions by month." />
      <MonthlyTransactionList />
    </AppShell>
  );
}
