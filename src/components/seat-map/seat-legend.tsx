import {
  premiumSeatClassName,
  seatStateClassName,
  selectedSeatClassName,
} from "@/components/seat-map/seat-cell";
import { cn } from "@/lib/utils";
import type { SeatStatus } from "@/types/domain";

type LegendItem = {
  id: string;
  label: string;
  className: string;
};

const statusLabels = {
  AVAILABLE: "Available",
  HELD: "Held",
  BOOKED: "Booked",
  UNAVAILABLE: "Unavailable",
} satisfies Record<SeatStatus, string>;

const statusLegendItems: LegendItem[] = Object.entries(statusLabels).map(
  ([status, label]) => ({
    id: `legend-${status.toLowerCase()}`,
    label,
    className: seatStateClassName[status as SeatStatus],
  })
);

const overlayLegendItems: LegendItem[] = [
  {
    id: "legend-selected",
    label: "Allocated to this booking",
    className: selectedSeatClassName,
  },
  {
    id: "legend-premium",
    label: "Premium seat",
    className: cn(seatStateClassName.AVAILABLE, premiumSeatClassName),
  },
];

function LegendSwatch({ item }: { item: LegendItem }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 rounded-sm border transition-colors",
          item.className
        )}
      />
      <span className="text-muted-foreground">{item.label}</span>
    </div>
  );
}

export function SeatLegend() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="mt-4 flex flex-wrap gap-4">
        {statusLegendItems.map((item) => (
          <LegendSwatch key={item.id} item={item} />
        ))}
        {overlayLegendItems.map((item) => (
          <LegendSwatch key={item.id} item={item} />
        ))}
      </div>
      {/* <div className="flex flex-wrap gap-4">
        {overlayLegendItems.map((item) => (
          <LegendSwatch key={item.id} item={item} />
        ))}
      </div> */}
    </div>
  );
}
