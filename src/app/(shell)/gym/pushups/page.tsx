import { PushupForm } from "@/components/pushups/PushupForm";
import { PushupTodayHeader } from "@/components/pushups/PushupTodayHeader";
import { PushupTargetCard } from "@/components/pushups/PushupTargetCard";
import { PushupChart } from "@/components/pushups/PushupChart";
import { PushupTodayList } from "@/components/pushups/PushupTodayList";
import { PushupHistory } from "@/components/pushups/PushupHistory";

export const metadata = { title: "Push-ups" };

export default function PushupsPage() {
  return (
    <div className="space-y-6">
      <PushupForm />
      <div className="grid gap-4 sm:grid-cols-2">
        <PushupTodayHeader />
        <PushupTargetCard />
      </div>
      <PushupChart />
      <PushupTodayList />
      <PushupHistory />
    </div>
  );
}
