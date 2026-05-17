import { PageHeader } from "@/components/ui/PageHeader";
import { WaterControls } from "@/components/water/WaterControls";
import { WaterGoalCard } from "@/components/water/WaterGoalCard";
import { WaterHistory } from "@/components/water/WaterHistory";

export const metadata = { title: "Water" };

export default function WaterPage() {
  return (
    <>
      <PageHeader title="Water" subtitle="Hit your daily cups." />
      <div className="space-y-6">
        <WaterControls />
        <WaterGoalCard />
        <WaterHistory />
      </div>
    </>
  );
}
