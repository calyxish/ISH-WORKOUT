import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

export default function MealsPage() {
  return (
    <>
      <PageHeader title="Meals" subtitle="Log when you eat." />
      <Card>
        <CardTitle>Coming in Phase 6</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Quick meal entry with today's timeline and historical view.
        </p>
      </Card>
    </>
  );
}
