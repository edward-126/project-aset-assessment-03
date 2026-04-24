import type { Screen, Seat } from "@/types/domain";
import {
  AllocationError,
  type AllocationCandidate,
  type AllocationRequest,
  type AllocationResult,
  type ValidAllocationRequest,
} from "./allocation-types";
import { SeatScoringService } from "./seat-scoring-service";
import { SplitAllocationService } from "./split-allocation-service";
import {
  getAllocatableSeats,
  groupSeatsByRow,
  isContiguousSeatGroup,
  sortSeatsForAllocation,
} from "./seat-utils";

export class AllocationService {
  constructor(
    private readonly scoringService = new SeatScoringService(),
    private readonly splitAllocationService = new SplitAllocationService(
      scoringService
    )
  ) {}

  allocateSeats(screen: Screen, groupSize: number): Seat[] {
    return this.allocate({ screen, groupSize }).seats;
  }

  allocate(request: AllocationRequest): AllocationResult {
    const { screen, groupSize } = this.validateAllocationRequest(request);
    const contiguousCandidates = this.findContiguousCandidates(
      screen,
      groupSize
    );

    const rankedCandidates =
      contiguousCandidates.length > 0
        ? this.rankContiguousCandidates(contiguousCandidates, screen)
        : this.splitAllocationService.rankSplitCandidates(
            this.splitAllocationService.generateSplitCandidates(
              screen,
              groupSize
            ),
            screen
          );

    const bestCandidate = rankedCandidates[0];

    if (!bestCandidate) {
      throw new AllocationError(
        "INSUFFICIENT_AVAILABLE_SEATS",
        "No valid seat allocation could be found for this request."
      );
    }

    return {
      screenId: screen.id,
      groupSize,
      mode: bestCandidate.mode,
      seats: sortSeatsForAllocation(bestCandidate.seats),
      score: bestCandidate.score,
      candidate: bestCandidate,
    };
  }

  findContiguousCandidates(screen: Screen, groupSize: number) {
    if (groupSize <= 0) {
      return [];
    }

    const candidates: Seat[][] = [];

    for (const row of groupSeatsByRow(screen.seats)) {
      let currentAvailableRun: Seat[] = [];

      for (const seat of sortSeatsForAllocation(row.seats)) {
        if (seat.status === "AVAILABLE") {
          const previousSeat = currentAvailableRun.at(-1);

          if (
            !previousSeat ||
            previousSeat.seatNumber + 1 === seat.seatNumber
          ) {
            currentAvailableRun.push(seat);
          } else {
            candidates.push(
              ...this.windowsFromAvailableRun(currentAvailableRun, groupSize)
            );
            currentAvailableRun = [seat];
          }

          continue;
        }

        candidates.push(
          ...this.windowsFromAvailableRun(currentAvailableRun, groupSize)
        );
        currentAvailableRun = [];
      }

      candidates.push(
        ...this.windowsFromAvailableRun(currentAvailableRun, groupSize)
      );
    }

    return candidates;
  }

  private validateAllocationRequest({
    screen,
    groupSize,
  }: AllocationRequest): ValidAllocationRequest {
    if (!screen) {
      throw new AllocationError(
        "MISSING_SCREEN",
        "A valid screen is required before seats can be allocated."
      );
    }

    if (!Number.isInteger(groupSize) || groupSize <= 0) {
      throw new AllocationError(
        "INVALID_GROUP_SIZE",
        "Group size must be a positive whole number."
      );
    }

    if (groupSize > screen.seats.length) {
      throw new AllocationError(
        "GROUP_TOO_LARGE",
        "Group size exceeds the total seat capacity for this screen."
      );
    }

    if (getAllocatableSeats(screen).length < groupSize) {
      throw new AllocationError(
        "INSUFFICIENT_AVAILABLE_SEATS",
        "There are not enough available seats for this request."
      );
    }

    return { screen, groupSize };
  }

  private rankContiguousCandidates(
    candidates: readonly Seat[][],
    screen: Screen
  ): AllocationCandidate[] {
    return candidates
      .filter(isContiguousSeatGroup)
      .map((candidate) =>
        this.scoringService.scoreContiguousCandidate(candidate, screen)
      )
      .sort((a, b) => this.scoringService.compareCandidates(a, b));
  }

  private windowsFromAvailableRun(run: readonly Seat[], groupSize: number) {
    if (run.length < groupSize) {
      return [];
    }

    return Array.from({ length: run.length - groupSize + 1 }, (_, index) =>
      run.slice(index, index + groupSize)
    );
  }
}
