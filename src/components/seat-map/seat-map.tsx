import { SeatCell } from "@/components/seat-map/seat-cell";
import { SeatLegend } from "@/components/seat-map/seat-legend";
import { toSeatMapSeatView } from "@/types/ui";
import type { Screen } from "@/types/domain";

export function SeatMap({
  screen,
  selectedSeatIds = new Set<string>(),
}: {
  screen: Screen;
  selectedSeatIds?: ReadonlySet<string>;
}) {
  const rows = Array.from(
    screen.seats
      .map((seat) => toSeatMapSeatView(seat, selectedSeatIds))
      .reduce((rowMap, seat) => {
        const row = rowMap.get(seat.rowLabel) ?? [];
        row.push(seat);
        rowMap.set(seat.rowLabel, row);
        return rowMap;
      }, new Map<string, ReturnType<typeof toSeatMapSeatView>[]>())
  ).map(([rowLabel, seats]) => ({
    rowLabel,
    seats: seats.sort((left, right) => left.seatNumber - right.seatNumber),
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-muted text-muted-foreground border-border rounded-md border px-4 py-2 text-center text-xs font-medium uppercase tracking-normal">
        Screen
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max flex-col items-center gap-2">
          {rows.map((row) => (
            <div
              key={row.rowLabel}
              className="grid grid-cols-[2.25rem_auto_2.25rem] items-center gap-2"
            >
              <div className="text-muted-foreground flex size-9 shrink-0 items-center justify-center font-mono text-xs">
                {row.rowLabel}
              </div>
              <div className="flex gap-2">
                {row.seats.map((seat) => (
                  <SeatCell key={seat.id} seat={seat} />
                ))}
              </div>
              <div aria-hidden="true" className="size-9" />
            </div>
          ))}
        </div>
      </div>
      <SeatLegend />
    </div>
  );
}
