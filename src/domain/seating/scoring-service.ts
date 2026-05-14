import { CINEMA_ROW_LABELS } from "./cinema-layout";
import type { AllocationRequest, ScoreBreakdown } from "./allocation-types";
import { countOrphanGapsAfterAllocation } from "./orphan-gap";
import type { Seat, SeatMap } from "./types";

const CINEMA_COLUMN_CENTER = 14.5;
const PREFERRED_ROW_INDEX = CINEMA_ROW_LABELS.indexOf("H");

export function scoreCandidate(
  seatMap: SeatMap,
  candidate: readonly Seat[],
  request: AllocationRequest,
  tieBreaker: number
): ScoreBreakdown {
  const orphanSeatPenalty = countOrphanGapsAfterAllocation(seatMap, candidate);
  const centreDistancePenalty = calculateCentreDistance(candidate);
  const rowPreferencePenalty = calculateRowPreferencePenalty(candidate);
  const restrictedSeatPenalty = calculateRestrictedSeatPenalty(
    candidate,
    request
  );
  const splitPenalty = 0;

  const total =
    orphanSeatPenalty * 100 +
    restrictedSeatPenalty * 50 +
    splitPenalty * 80 +
    centreDistancePenalty * 2 +
    rowPreferencePenalty +
    tieBreaker;

  return {
    orphanSeatPenalty,
    centreDistancePenalty,
    rowPreferencePenalty,
    restrictedSeatPenalty,
    splitPenalty,
    tieBreaker,
    total,
  };
}

export function compareScoreBreakdowns(
  left: ScoreBreakdown,
  right: ScoreBreakdown
) {
  return left.total - right.total;
}

export function calculateCentreDistance(candidate: readonly Seat[]) {
  const midpoint =
    candidate.reduce((total, seat) => total + seat.column, 0) /
    candidate.length;

  return Math.abs(midpoint - CINEMA_COLUMN_CENTER);
}

function calculateRowPreferencePenalty(candidate: readonly Seat[]) {
  const averageRowIndex =
    candidate.reduce(
      (total, seat) => total + getCinemaRowIndex(seat.row),
      0
    ) / candidate.length;

  return Math.abs(averageRowIndex - PREFERRED_ROW_INDEX);
}

function getCinemaRowIndex(row: string) {
  const index = CINEMA_ROW_LABELS.findIndex((rowLabel) => rowLabel === row);

  return index >= 0 ? index : PREFERRED_ROW_INDEX;
}

function calculateRestrictedSeatPenalty(
  candidate: readonly Seat[],
  request: AllocationRequest
) {
  if (request.requestType !== "adminOverride") {
    return 0;
  }

  return candidate.filter(
    (seat) => seat.state !== "available" || seat.zone !== "standard"
  ).length;
}
