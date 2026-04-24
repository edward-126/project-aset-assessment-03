import type { Screen, Seat } from "@/types/domain";
import {
  getSeatKeySet,
  groupSeatsByRow,
  sortSeatsForAllocation,
} from "./seat-utils";

const ISOLATED_SINGLE_SEAT_PENALTY = 8;
const SINGLE_SEAT_EDGE_PENALTY = 4;
const TWO_SEAT_FRAGMENT_PENALTY = 2;

export class FragmentationAnalyzer {
  calculateFragmentationPenalty(candidate: readonly Seat[], screen: Screen) {
    const candidateKeys = getSeatKeySet(candidate);

    return groupSeatsByRow(screen.seats).reduce((total, row) => {
      const segments = this.getAvailableSegmentsAfterAllocation(
        row.seats,
        candidateKeys
      );

      return (
        total +
        segments.reduce(
          (rowTotal, segment) =>
            rowTotal + this.calculateSegmentPenalty(segment, row.seats),
          0
        )
      );
    }, 0);
  }

  detectSingleSeatGaps(rowSeats: readonly Seat[], candidate: readonly Seat[]) {
    const candidateKeys = getSeatKeySet(candidate);

    return this.getAvailableSegmentsAfterAllocation(
      rowSeats,
      candidateKeys
    ).filter((segment) => segment.length === 1).length;
  }

  private getAvailableSegmentsAfterAllocation(
    rowSeats: readonly Seat[],
    candidateKeys: ReadonlySet<string>
  ) {
    const segments: Seat[][] = [];
    let currentSegment: Seat[] = [];

    for (const seat of sortSeatsForAllocation(rowSeats)) {
      const isAvailableAfterAllocation =
        seat.status === "AVAILABLE" &&
        !candidateKeys.has(`${seat.rowLabel}:${seat.seatNumber}`);

      if (isAvailableAfterAllocation) {
        currentSegment.push(seat);
        continue;
      }

      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }

    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    return segments;
  }

  private calculateSegmentPenalty(
    segment: readonly Seat[],
    rowSeats: readonly Seat[]
  ) {
    if (segment.length === 1) {
      return this.isEdgeSegment(segment[0], rowSeats)
        ? SINGLE_SEAT_EDGE_PENALTY
        : ISOLATED_SINGLE_SEAT_PENALTY;
    }

    if (segment.length === 2) {
      return TWO_SEAT_FRAGMENT_PENALTY;
    }

    return 0;
  }

  private isEdgeSegment(seat: Seat, rowSeats: readonly Seat[]) {
    const sortedRowSeats = sortSeatsForAllocation(rowSeats);
    return (
      seat.seatNumber === sortedRowSeats[0]?.seatNumber ||
      seat.seatNumber === sortedRowSeats.at(-1)?.seatNumber
    );
  }
}
