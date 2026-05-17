import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTabs, type SectionTab } from "@/components/ui/SectionTabs";

const TABS: SectionTab[] = [
  { href: "/gym/weight", label: "Weight" },
];

export default function GymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title="Gym" subtitle="Weight and conditioning." />
      <div className="mb-6">
        <SectionTabs items={TABS} label="Gym sections" />
      </div>
      {children}
    </>
  );
}
