import { cn } from "@/lib/utils";
import type { SeatMapSeatView } from "@/types/ui";

export const seatStateClassName: Record<SeatMapSeatView["status"], string> = {
  AVAILABLE: "bg-background text-foreground hover:bg-muted",
  HELD: "bg-secondary text-muted-foreground",
  BOOKED: "bg-destructive/10 text-destructive border-destructive/30",
  UNAVAILABLE:
    "bg-accent/40 border-foreground/20 border-dashed border text-muted-foreground opacity-60",
};

export const selectedSeatClassName =
  "bg-primary text-primary-foreground border-primary";

export const premiumSeatClassName = "ring-primary/30 ring-2 ring-offset-1";

export function SeatCell({ seat }: { seat: SeatMapSeatView }) {
  return (
    <div
      title={`${seat.label} ${seat.status.toLowerCase()}`}
      aria-label={`${seat.label} ${seat.status.toLowerCase()}`}
      className={cn(
        "flex size-9 select-none items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors",
        seatStateClassName[seat.status],
        seat.type === "PREMIUM" && premiumSeatClassName,
        seat.isSelected && selectedSeatClassName
      )}
    >
      {seat.seatNumber}
    </div>
  );
}
