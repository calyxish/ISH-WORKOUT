import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTabs, type SectionTab } from "@/components/ui/SectionTabs";

const TABS: SectionTab[] = [
  { href: "/diet/meals", label: "Meals" },
  { href: "/diet/water", label: "Water" },
];

export default function DietLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title="Diet" subtitle="What goes in — meals and water." />
      <div className="mb-6">
        <SectionTabs items={TABS} label="Diet sections" />
      </div>
      {children}
    </>
  );
}
