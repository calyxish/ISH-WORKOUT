import { WeightForm } from "@/components/weight/WeightForm";
import { WeightDashboardHeader } from "@/components/weight/WeightDashboardHeader";
import { WeightChart } from "@/components/weight/WeightChart";
import { WeightList } from "@/components/weight/WeightList";

export const metadata = { title: "Weight" };

export default function WeightPage() {
  return (
    <div className="space-y-6">
      <WeightForm />
      <WeightDashboardHeader />
      <WeightChart />
      <WeightList />
    </div>
  );
}
