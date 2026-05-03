import { AppShell } from "@/components/app-shell/app-shell";
import { PageHeader } from "@/components/app-shell/page-header";
import { AddTransactionForm } from "@/components/forms/add-transaction-form";

export default function AddPage() {
  return (
    <AppShell>
      <PageHeader title="Add" description="Capture expense or income for this month." />
      <AddTransactionForm />
    </AppShell>
  );
}
