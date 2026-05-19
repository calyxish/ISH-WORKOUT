import { PageHeader } from "@/components/ui/PageHeader";
import { ThemeCard } from "@/components/settings/ThemeCard";
import { GoalsCard } from "@/components/settings/GoalsCard";
import { DataCard } from "@/components/settings/DataCard";
import { TodosCard } from "@/components/settings/TodosCard";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Goals, theme, and your data." />
      <div className="space-y-6">
        <GoalsCard />
        <TodosCard />
        <ThemeCard />
        <DataCard />
      </div>
    </>
  );
}
