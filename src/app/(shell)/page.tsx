import { PageHeader } from "@/components/ui/PageHeader";
import { WeightTile } from "@/components/dashboard/WeightTile";
import { TodosTile } from "@/components/dashboard/TodosTile";
import { MealsTile } from "@/components/dashboard/MealsTile";
import { WaterTile } from "@/components/dashboard/WaterTile";

export default function Home() {
  return (
    <>
      <PageHeader
        title="ISH Workout"
        subtitle="Today, at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <WeightTile />
        <TodosTile />
        <MealsTile />
        <WaterTile />
      </div>
    </>
  );
}
