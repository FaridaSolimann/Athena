"use client";

import { CircleAlert, KeyRound, Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUi } from "@/lib/ui";

const COPY = {
  rate_limited: {
    icon: Gauge,
    label: "Gemini credits exhausted",
    detail:
      "The Gemini API quota is used up, so questions and uploads are running on the built-in engine until it resets. Everything still works — answers are pattern-matched and uploads map to sample contracts.",
  },
  unavailable: {
    icon: CircleAlert,
    label: "Gemini unavailable",
    detail:
      "The last Gemini call failed, so Athena is running on the built-in engine. It will recover automatically on the next successful call.",
  },
  no_key: {
    icon: KeyRound,
    label: "Live AI off",
    detail:
      "No Gemini key is configured (.env.local), so Explore and uploads use the built-in engine. Add a key to enable live parsing.",
  },
} as const;

/** Global quota/health indicator — lights up on every page when the live
 * Gemini paths degrade, instead of failing silently into the fallbacks. */
export function AiStatusPill() {
  const health = useUi((s) => s.aiHealth);
  if (health === "ok") return null;
  const { icon: Icon, label, detail } = COPY[health];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 cursor-default items-center gap-1.5 rounded-full bg-trust-medium-bg px-2.5 py-1 text-[11.5px] font-medium text-trust-medium">
          <Icon className="size-3.5" />
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-72 text-xs leading-relaxed">{detail}</TooltipContent>
    </Tooltip>
  );
}
