import type { LucideIcon } from "lucide-react";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function StepCard({
  step,
  title,
  description,
  icon: Icon,
}: StepCardProps) {
  const titleId = `step-title-${step}`;
  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5"
      aria-labelledby={titleId}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="text-xs font-semibold tracking-[0.2em] text-accent">
          {step}
        </span>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/15"
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
      <h3
        id={titleId}
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
