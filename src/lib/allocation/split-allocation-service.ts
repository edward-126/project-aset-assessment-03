import type { Screen, Seat } from "@/types/domain";
import { SeatScoringService } from "./seat-scoring-service";
import {
  getAllocatableSeats,
  groupSeatsByRow,
  splitIntoClusters,
} from "./seat-utils";

const MAX_SPLIT_CANDIDATES_PER_SIZE = 80;

export class SplitAllocationService {
  constructor(private readonly scoringService = new SeatScoringService()) {}

  generateSplitCandidates(screen: Screen, groupSize: number) {
    const availableSeats = getAllocatableSeats(screen);

    if (groupSize <= 0 || availableSeats.length < groupSize) {
      return [];
    }

    const candidates: Seat[][] = [];
    const rowBasedCandidates = this.generateRowBasedCandidates(
      screen,
      groupSize
    );

    candidates.push(...rowBasedCandidates);

    if (candidates.length === 0) {
      candidates.push(
        ...this.generateGreedyNearbyCandidates(screen, groupSize)
      );
    }

    const uniqueCandidates = this.dedupeCandidates(candidates)
      .filter((candidate) => candidate.length === groupSize)
      .filter((candidate) => splitIntoClusters(candidate).length > 1);

    return this.rankSplitCandidates(uniqueCandidates, screen)
      .slice(0, MAX_SPLIT_CANDIDATES_PER_SIZE)
      .map((candidate) => candidate.seats);
  }

  rankSplitCandidates(candidates: readonly Seat[][], screen: Screen) {
    return candidates
      .map((candidate) =>
        this.scoringService.scoreSplitCandidate(candidate, screen)
      )
      .sort((a, b) => this.scoringService.compareCandidates(a, b));
  }

  private generateRowBasedCandidates(screen: Screen, groupSize: number) {
    const candidates: Seat[][] = [];

    for (const row of groupSeatsByRow(getAllocatableSeats(screen))) {
      const rowSeats = row.seats;

      if (rowSeats.length < groupSize) {
        continue;
      }

      const bestRowSeats = this.pickCenteredSeats(rowSeats, groupSize, screen);
      candidates.push(bestRowSeats);
    }

    return candidates;
  }

  private generateGreedyNearbyCandidates(screen: Screen, groupSize: number) {
    const rows = groupSeatsByRow(getAllocatableSeats(screen));
    const candidates: Seat[][] = [];

    for (let startIndex = 0; startIndex < rows.length; startIndex += 1) {
      const selectedSeats: Seat[] = [];

      for (
        let rowIndex = startIndex;
        rowIndex < rows.length && selectedSeats.length < groupSize;
        rowIndex += 1
      ) {
        const remainingSeatsNeeded = groupSize - selectedSeats.length;
        const rowSeats = this.pickCenteredSeats(
          rows[rowIndex].seats,
          Math.min(remainingSeatsNeeded, rows[rowIndex].seats.length),
          screen
        );

        selectedSeats.push(...rowSeats);
      }

      if (selectedSeats.length === groupSize) {
        candidates.push(selectedSeats);
      }
    }

    return candidates;
  }

  private pickCenteredSeats(
    seats: readonly Seat[],
    count: number,
    screen: Screen
  ) {
    return [...seats]
      .sort((a, b) => {
        const center = (screen.totalColumns + 1) / 2;
        const aDistance = Math.abs(a.seatNumber - center);
        const bDistance = Math.abs(b.seatNumber - center);

        if (aDistance !== bDistance) {
          return aDistance - bDistance;
        }

        if (a.seatNumber !== b.seatNumber) {
          return a.seatNumber - b.seatNumber;
        }

        return a.id.localeCompare(b.id);
      })
      .slice(0, count)
      .sort((a, b) => a.seatNumber - b.seatNumber);
  }

  private dedupeCandidates(candidates: readonly Seat[][]) {
    const seen = new Set<string>();
    const uniqueCandidates: Seat[][] = [];

    for (const candidate of candidates) {
      const key = candidate
        .map((seat) => seat.id)
        .sort()
        .join("|");

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      uniqueCandidates.push(candidate);
    }

    return uniqueCandidates;
  }
}
