import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

export default function TodosPage() {
  return (
    <>
      <PageHeader title="Todos" subtitle="One simple list per day." />
      <Card>
        <CardTitle>Coming in Phase 5</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Add, check, edit, and archive todos with automatic midnight rollover.
        </p>
      </Card>
    </>
  );
}
