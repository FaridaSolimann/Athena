"use client";

import type { Contract } from "@/data/types";
import { daysFromToday } from "@/lib/demo-clock";
import { fmtDate, fmtMoneyFull, fmtRelative } from "@/lib/format";
import { TrustedFact } from "@/components/trust/TrustedFact";
import { cn } from "@/lib/utils";

/** The top-line, plain-language read of a contract — what an exec stops at.
 * Every number in it is a TrustedFact, so the depth ladder starts here. */
export function AtAGlance({ contract }: { contract: Contract }) {
  const termYears =
    contract.expirationDate &&
    Math.round(
      (Date.parse(contract.expirationDate) - Date.parse(contract.effectiveDate)) /
        (365.25 * 86_400_000)
    );

  const noticeField = contract.fields.find((f) => f.key === "notice_deadline");
  const noticeIso = noticeField?.value.kind === "date" ? noticeField.value.iso : null;
  const noticeDays = noticeIso ? daysFromToday(noticeIso) : null;
  const urgent = noticeDays !== null && noticeDays >= 0 && noticeDays <= 30;

  const valueFieldId = contract.fields.some((f) => f.key === "total_value")
    ? `${contract.id}:total_value`
    : null;

  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-[14px] leading-relaxed">
        {termYears ? `${termYears}-year ` : ""}
        {contract.type === "SaaS" ? "subscription" : contract.type.toLowerCase()} with{" "}
        <span className="font-medium">{contract.counterparty}</span>
        {contract.valueUsd > 0 && valueFieldId ? (
          <>
            {", "}
            <TrustedFact contractId={contract.id} fieldId={valueFieldId} variant="inline" />
            {" total"}
          </>
        ) : contract.valueUsd > 0 ? (
          `, ${fmtMoneyFull(contract.valueUsd)} total`
        ) : null}
        {contract.expirationDate
          ? `, running ${fmtDate(contract.effectiveDate)} to ${fmtDate(contract.expirationDate)}.`
          : `, effective ${fmtDate(contract.effectiveDate)}.`}{" "}
        {contract.autoRenew && noticeIso && (
          <span className={cn(urgent && "font-medium text-trust-low")}>
            Renews automatically
            {contract.renewalTermMonths
              ? ` for another ${contract.renewalTermMonths} months`
              : ""}{" "}
            unless notice is given by {fmtDate(noticeIso)} ({fmtRelative(noticeIso)}).
          </span>
        )}
        {contract.autoRenew && !noticeIso && (
          <span className="font-medium text-trust-medium">
            Appears to renew automatically — the notice window could not be read.
          </span>
        )}
        {!contract.autoRenew && contract.expirationDate && daysFromToday(contract.expirationDate) < 0 && (
          <span className="text-muted-foreground">
            This agreement has ended.
          </span>
        )}
      </p>
    </div>
  );
}
