import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Goals, theme, and data." />
      <Card>
        <CardTitle>Coming in Phase 8</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Target weight, water goal, theme picker, and JSON export/import.
        </p>
      </Card>
    </>
  );
}
