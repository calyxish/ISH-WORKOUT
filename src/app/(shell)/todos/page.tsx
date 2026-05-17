import { PageHeader } from "@/components/ui/PageHeader";
import { TodayTodos } from "@/components/todos/TodayTodos";
import { TodoHistory } from "@/components/todos/TodoHistory";

export const metadata = { title: "Todos" };

export default function TodosPage() {
  return (
    <>
      <PageHeader title="Todos" subtitle="One list per day. Resets at midnight." />
      <div className="space-y-8">
        <TodayTodos />
        <TodoHistory />
      </div>
    </>
  );
}
