import { Sidebar } from "@/components/shell/Sidebar";
import { MobileTopBar } from "@/components/shell/MobileTopBar";
import { BottomNav } from "@/components/shell/BottomNav";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
