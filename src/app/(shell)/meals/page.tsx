import { PageHeader } from "@/components/ui/PageHeader";
import { TodayMeals } from "@/components/meals/TodayMeals";
import { MealHistory } from "@/components/meals/MealHistory";

export const metadata = { title: "Meals" };

export default function MealsPage() {
  return (
    <>
      <PageHeader title="Meals" subtitle="Log when you eat." />
      <div className="space-y-8">
        <TodayMeals />
        <MealHistory />
      </div>
    </>
  );
}
