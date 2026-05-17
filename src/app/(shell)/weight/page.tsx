import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

export default function WeightPage() {
  return (
    <>
      <PageHeader
        title="Weight"
        subtitle="Log weigh-ins, set a target, watch the trend."
      />
      <Card>
        <CardTitle>Coming in Phase 3</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Quick-entry form, history list, and target-weight setting land in the
          next phases. The graph with time-range filters arrives in Phase 4.
        </p>
      </Card>
    </>
  );
}
