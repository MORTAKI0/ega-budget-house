import { AppShell } from "@/components/app-shell/app-shell";
import { LogoutButton } from "@/components/app-shell/logout-button";
import { PageHeader } from "@/components/app-shell/page-header";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Settings" description="Budget settings placeholder." />
      <LogoutButton />
    </AppShell>
  );
}
