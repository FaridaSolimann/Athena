"use client";

/** Every Insights tab leads with its plain-language takeaway. */
export function TakeawayCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/25 bg-accent/60 p-4">
      <p className="text-[14.5px] font-medium leading-relaxed">{children}</p>
    </div>
  );
}

export function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
