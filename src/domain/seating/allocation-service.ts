import type {
  AllocationRequest,
  AllocationResult,
  ScoredCandidate,
  ScoreBreakdown,
} from "./allocation-types";
import { findContiguousBlocks, sortSeats } from "./candidate-generator";
import { scoreCandidate, compareScoreBreakdowns } from "./scoring-service";
import { validateCandidate } from "./constraint-validator";
import type { Seat, SeatMap } from "./types";

export function allocateSeats(
  seatMap: SeatMap,
  request: AllocationRequest
): AllocationResult {
  const requestError = validateAllocationRequest(request);

  if (requestError) {
    return {
      status: "REJECTED",
      selectedSeats: [],
      reason: requestError,
      consideredCandidateCount: 0,
      rejectedCandidateCount: 0,
    };
  }

  if (request.requestType === "adminOverride") {
    return allocateWithAdminOverride(seatMap, request);
  }

  const candidates = findContiguousBlocks(seatMap, request.groupSize);
  const rankedCandidates = rankValidCandidates(seatMap, candidates, request);

  if (rankedCandidates.length > 0) {
    const bestCandidate = rankedCandidates[0];

    return {
      status: "ALLOCATED",
      selectedSeats: seatIds(bestCandidate.seats),
      reason:
        "Allocated the lowest-scoring contiguous block that satisfies all seating constraints.",
      scoreBreakdown: bestCandidate.scoreBreakdown,
      consideredCandidateCount: candidates.length,
      rejectedCandidateCount: candidates.length - rankedCandidates.length,
    };
  }

  if (request.allowSplit) {
    return allocateSplit(seatMap, request, candidates.length);
  }

  return {
    status: "REJECTED",
    selectedSeats: [],
    reason:
      "No valid same-row contiguous block satisfies the request and seating constraints.",
    consideredCandidateCount: candidates.length,
    rejectedCandidateCount: candidates.length,
  };
}

function allocateWithAdminOverride(
  seatMap: SeatMap,
  request: AllocationRequest
): AllocationResult {
  const candidates = findContiguousBlocks(seatMap, request.groupSize);
  const rankedCandidates = candidates
    .map((candidate, index) => ({
      seats: candidate,
      scoreBreakdown: scoreCandidate(seatMap, candidate, request, index / 1000),
    }))
    .sort(compareScoredCandidates);
  const bestCandidate = rankedCandidates[0];

  if (!bestCandidate) {
    return {
      status: "REJECTED",
      selectedSeats: [],
      reason: "No physical seat block exists for the override request.",
      consideredCandidateCount: candidates.length,
      rejectedCandidateCount: 0,
    };
  }

  return {
    status: "OVERRIDE_ALLOCATED",
    selectedSeats: seatIds(bestCandidate.seats),
    reason:
      "Admin override allocated the best physical block while bypassing normal seat-state and restriction rules.",
    scoreBreakdown: bestCandidate.scoreBreakdown,
    consideredCandidateCount: candidates.length,
    rejectedCandidateCount: 0,
  };
}

function allocateSplit(
  seatMap: SeatMap,
  request: AllocationRequest,
  contiguousCandidateCount: number
): AllocationResult {
  const singleSeatCandidates = findContiguousBlocks(seatMap, 1);
  const rankedSingleSeats = rankValidCandidates(seatMap, singleSeatCandidates, {
    ...request,
    groupSize: 1,
  });
  const selectedSeats = rankedSingleSeats
    .slice(0, request.groupSize)
    .flatMap((candidate) => candidate.seats);

  if (selectedSeats.length < request.groupSize) {
    return {
      status: "REJECTED",
      selectedSeats: [],
      reason: "No contiguous or controlled split allocation can satisfy the request.",
      consideredCandidateCount: contiguousCandidateCount + singleSeatCandidates.length,
      rejectedCandidateCount:
        contiguousCandidateCount +
        singleSeatCandidates.length -
        rankedSingleSeats.length,
    };
  }

  const scoreBreakdown = scoreSplitAllocation(seatMap, selectedSeats, request);

  return {
    status: "SPLIT_ALLOCATED",
    selectedSeats: seatIds(selectedSeats),
    reason:
      "No valid contiguous block was available, so a controlled split allocation was used.",
    scoreBreakdown,
    consideredCandidateCount: contiguousCandidateCount + singleSeatCandidates.length,
    rejectedCandidateCount:
      contiguousCandidateCount +
      singleSeatCandidates.length -
      rankedSingleSeats.length,
  };
}

function rankValidCandidates(
  seatMap: SeatMap,
  candidates: readonly Seat[][],
  request: AllocationRequest
): ScoredCandidate[] {
  return candidates
    .map((candidate, index) => {
      const validation = validateCandidate(candidate, request, seatMap);

      if (!validation.valid) {
        return null;
      }

      return {
        seats: candidate,
        scoreBreakdown: scoreCandidate(seatMap, candidate, request, index / 1000),
      };
    })
    .filter((candidate): candidate is ScoredCandidate => Boolean(candidate))
    .sort(compareScoredCandidates);
}

function validateAllocationRequest(request: AllocationRequest) {
  if (!Number.isInteger(request.groupSize)) {
    return "Group size must be a whole number between 1 and 7.";
  }

  if (request.groupSize < 1 || request.groupSize > 7) {
    return "Group size must be between 1 and 7.";
  }

  return null;
}

function scoreSplitAllocation(
  seatMap: SeatMap,
  selectedSeats: readonly Seat[],
  request: AllocationRequest
): ScoreBreakdown {
  const baseScore = scoreCandidate(seatMap, selectedSeats, request, 0);
  const splitPenalty = Math.max(0, selectedSeats.length - 1);
  const total =
    baseScore.orphanSeatPenalty * 100 +
    baseScore.restrictedSeatPenalty * 50 +
    splitPenalty * 80 +
    baseScore.centreDistancePenalty * 2 +
    baseScore.rowPreferencePenalty +
    baseScore.tieBreaker;

  return {
    ...baseScore,
    splitPenalty,
    total,
  };
}

function compareScoredCandidates(left: ScoredCandidate, right: ScoredCandidate) {
  const scoreComparison = compareScoreBreakdowns(
    left.scoreBreakdown,
    right.scoreBreakdown
  );

  if (scoreComparison !== 0) {
    return scoreComparison;
  }

  return seatIds(left.seats).join("|").localeCompare(seatIds(right.seats).join("|"));
}

function seatIds(seats: readonly Seat[]) {
  return sortSeats(seats).map((seat) => seat.id);
}
