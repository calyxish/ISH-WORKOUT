import { TodayMeals } from "@/components/meals/TodayMeals";
import { MealHistory } from "@/components/meals/MealHistory";

export const metadata = { title: "Meals" };

export default function MealsPage() {
  return (
    <div className="space-y-8">
      <TodayMeals />
      <MealHistory />
    </div>
  );
}
