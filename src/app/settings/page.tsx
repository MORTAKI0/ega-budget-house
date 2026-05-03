import { AppShell } from "@/components/app-shell/app-shell";
import { LogoutButton } from "@/components/app-shell/logout-button";
import { PageHeader } from "@/components/app-shell/page-header";
import { MonthlySettingsForm } from "@/components/settings/monthly-settings-form";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Settings" description="Set safe balance rules for each month." />
      <MonthlySettingsForm />
      <LogoutButton />
    </AppShell>
  );
}
