"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItemProps = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: FAQItemProps) {
  const id = useId();
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <h3 className="text-base font-medium">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-foreground transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="pr-2">{question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0" aria-hidden={!open}>
          <p className="pb-5 text-sm leading-relaxed text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}
