import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { HydrationGate } from "@/components/shell/HydrationGate";
import { ClausePeek } from "@/components/trust/ClausePeek";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex h-dvh min-w-[1100px] overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background">
            <HydrationGate>{children}</HydrationGate>
          </main>
        </div>
        <ClausePeek />
      </div>
    </TooltipProvider>
  );
}
