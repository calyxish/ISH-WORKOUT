import { WaterControls } from "@/components/water/WaterControls";
import { WaterGoalCard } from "@/components/water/WaterGoalCard";
import { WaterHistory } from "@/components/water/WaterHistory";

export const metadata = { title: "Water" };

export default function WaterPage() {
  return (
    <div className="space-y-6">
      <WaterControls />
      <WaterGoalCard />
      <WaterHistory />
    </div>
  );
}
