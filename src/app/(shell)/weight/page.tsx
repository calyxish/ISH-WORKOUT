import { PageHeader } from "@/components/ui/PageHeader";
import { WeightForm } from "@/components/weight/WeightForm";
import { WeightDashboardHeader } from "@/components/weight/WeightDashboardHeader";
import { WeightList } from "@/components/weight/WeightList";

export const metadata = { title: "Weight" };

export default function WeightPage() {
  return (
    <>
      <PageHeader
        title="Weight"
        subtitle="Log a weigh-in, set a target, see your history."
      />
      <div className="space-y-6">
        <WeightForm />
        <WeightDashboardHeader />
        <WeightList />
      </div>
    </>
  );
}
