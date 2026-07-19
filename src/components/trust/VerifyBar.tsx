"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FieldValue } from "@/data/types";
import type { EffectiveField } from "@/lib/selectors";
import { useOverlay } from "@/lib/store";
import { CURRENT_USER_ID } from "@/data";
import { fmtFieldValue } from "@/lib/format";

function parseCorrection(original: FieldValue, raw: string): FieldValue | null {
  const t = raw.trim();
  if (!t) return null;
  switch (original.kind) {
    case "money": {
      const n = Number(t.replace(/[$,\s]/g, "").replace(/[kK]$/, "000").replace(/[mM]$/, "000000"));
      return Number.isFinite(n) && n >= 0 ? { kind: "money", usd: Math.round(n) } : null;
    }
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(t) ? { kind: "date", iso: t } : null;
    case "duration": {
      const n = Number(t.replace(/[^\d]/g, ""));
      return Number.isFinite(n) && n > 0
        ? { kind: "duration", days: n, raw: `${n} days` }
        : null;
    }
    case "boolean":
      if (/^(y|yes|true)$/i.test(t)) return { kind: "boolean", value: true };
      if (/^(n|no|false)$/i.test(t)) return { kind: "boolean", value: false };
      return null;
    default:
      return { kind: "text", value: t };
  }
}

function placeholderFor(v: FieldValue): string {
  switch (v.kind) {
    case "money": return "e.g. 1500000 or $1.5M";
    case "date": return "YYYY-MM-DD";
    case "duration": return "days, e.g. 60";
    case "boolean": return "yes / no";
    default: return "Corrected value";
  }
}

/** Confirm / Edit / Reject actions for one extracted field. Writing to the
 * overlay updates every surface that renders this fact. */
export function VerifyBar({ ef, size = "sm" }: { ef: EffectiveField; size?: "sm" | "xs" }) {
  const verifyField = useOverlay((s) => s.verifyField);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pickedCandidate, setPickedCandidate] = useState<string | null>(null);

  const field = ef.field;
  const isAmbiguous = field.value.kind === "ambiguous";
  const btn = size === "xs" ? "h-6 px-2 text-[11.5px]" : "h-7 px-2.5 text-xs";

  const confirm = () => {
    verifyField(field.id, { status: "confirmed", by: CURRENT_USER_ID });
    toast.success(`${field.label} confirmed`, {
      description: `“${fmtFieldValue(field.value)}” is now treated as verified.`,
    });
  };

  const reject = () => {
    verifyField(field.id, { status: "rejected", by: CURRENT_USER_ID });
    toast(`${field.label} rejected`, {
      description: "Kept out of verified totals until a correct value is entered.",
    });
  };

  const saveCorrection = () => {
    let corrected: FieldValue | null = null;
    if (isAmbiguous && pickedCandidate) {
      corrected = { kind: "text", value: pickedCandidate };
    } else {
      corrected = parseCorrection(
        isAmbiguous ? { kind: "text", value: "" } : field.value,
        draft
      );
    }
    if (!corrected) {
      toast.error("Enter a valid value", { description: placeholderFor(field.value) });
      return;
    }
    verifyField(field.id, {
      status: "corrected",
      correctedValue: corrected,
      by: CURRENT_USER_ID,
    });
    setEditOpen(false);
    toast.success(`${field.label} corrected`, {
      description: `Now “${fmtFieldValue(corrected)}” — verified across the workspace.`,
    });
  };

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {!isAmbiguous && (
        <Button variant="outline" className={btn} onClick={confirm}>
          <Check className="size-3 text-trust-high" />
          Confirm
        </Button>
      )}
      <Popover open={editOpen} onOpenChange={setEditOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={btn}>
            <PencilLine className="size-3" />
            {isAmbiguous ? "Resolve" : "Edit"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-3">
          <p className="mb-2 text-[13px] font-medium">
            {isAmbiguous ? `Resolve ${field.label.toLowerCase()}` : `Correct ${field.label.toLowerCase()}`}
          </p>
          {isAmbiguous && field.value.kind === "ambiguous" && (
            <div className="mb-2 space-y-1.5">
              {field.value.candidates.map((c) => (
                <label
                  key={c.reading}
                  className="flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs has-[:checked]:border-primary has-[:checked]:bg-accent"
                >
                  <input
                    type="radio"
                    name={`cand-${field.id}`}
                    className="mt-0.5"
                    checked={pickedCandidate === c.value}
                    onChange={() => setPickedCandidate(c.value)}
                  />
                  <span>
                    <span className="font-medium">{c.value}</span>
                    <span className="block text-muted-foreground">{c.reading}</span>
                  </span>
                </label>
              ))}
              <p className="text-[11px] text-muted-foreground">Or enter a different reading:</p>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              autoFocus={!isAmbiguous}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (e.target.value) setPickedCandidate(null);
              }}
              placeholder={placeholderFor(field.value)}
              className="h-8 text-[13px]"
              onKeyDown={(e) => e.key === "Enter" && saveCorrection()}
            />
            <Button className="h-8 px-3 text-xs" onClick={saveCorrection}>
              Save
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Corrections are recorded with your name and treated as verified.
          </p>
        </PopoverContent>
      </Popover>
      {!isAmbiguous && (
        <Button
          variant="ghost"
          className={`${btn} text-muted-foreground hover:text-trust-low`}
          onClick={reject}
        >
          <X className="size-3" />
          Reject
        </Button>
      )}
    </div>
  );
}
