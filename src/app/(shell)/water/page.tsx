import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

export default function WaterPage() {
  return (
    <>
      <PageHeader title="Water" subtitle="Hit your daily cups." />
      <Card>
        <CardTitle>Coming in Phase 7</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Cup counter with progress ring and configurable daily goal.
        </p>
      </Card>
    </>
  );
}
