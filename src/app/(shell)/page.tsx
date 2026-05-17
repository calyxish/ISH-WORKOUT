import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";

const TILES = [
  {
    href: "/weight",
    title: "Weight",
    blurb: "Log a weigh-in and watch the trend.",
  },
  {
    href: "/todos",
    title: "Today's todos",
    blurb: "Plan the day, check things off.",
  },
  {
    href: "/meals",
    title: "Meals",
    blurb: "Log when you eat.",
  },
  {
    href: "/water",
    title: "Water",
    blurb: "Hit your daily cups.",
  },
];

export default function Home() {
  return (
    <>
      <PageHeader
        title="ISH Workout"
        subtitle="Track weight, todos, meals, and water — all on one screen."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-accent"
          >
            <CardTitle>{t.title}</CardTitle>
            <p className="mt-2 text-base text-text-primary">{t.blurb}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Open
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardTitle>Phase 1 — Foundation</CardTitle>
        <p className="mt-2 text-sm text-text-muted">
          Shell, theme toggle, logo, manifest, and service worker are live. The
          four feature areas will fill in over the next phases.
        </p>
      </Card>
    </>
  );
}
