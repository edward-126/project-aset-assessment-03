import type { Screen, Seat } from "@/types/domain";
import type {
  AllocationCandidate,
  AllocationMode,
  AllocationWeights,
  ScoreBreakdown,
} from "./allocation-types";
import { FragmentationAnalyzer } from "./fragmentation-analyzer";
import { compareSeatSets, getRowCenter, splitIntoClusters } from "./seat-utils";

const DEFAULT_WEIGHTS: AllocationWeights = {
  fragmentation: 100,
  center: 10,
  viewingZone: 15,
  cluster: 50,
  splitDistance: 5,
};

export class SeatScoringService {
  constructor(
    private readonly fragmentationAnalyzer = new FragmentationAnalyzer(),
    private readonly weights: AllocationWeights = DEFAULT_WEIGHTS
  ) {}

  scoreContiguousCandidate(candidate: readonly Seat[], screen: Screen) {
    return this.scoreCandidate(candidate, screen, "CONTIGUOUS");
  }

  scoreSplitCandidate(candidate: readonly Seat[], screen: Screen) {
    return this.scoreCandidate(candidate, screen, "SPLIT");
  }

  compareCandidates(a: AllocationCandidate, b: AllocationCandidate) {
    if (a.mode !== b.mode) {
      return a.mode === "CONTIGUOUS" ? -1 : 1;
    }

    if (a.fragmentationPenalty !== b.fragmentationPenalty) {
      return a.fragmentationPenalty - b.fragmentationPenalty;
    }

    if (a.mode === "SPLIT") {
      if (a.clusterCount !== b.clusterCount) {
        return a.clusterCount - b.clusterCount;
      }

      if (a.splitDistance !== b.splitDistance) {
        return a.splitDistance - b.splitDistance;
      }
    }

    if (a.centerDistance !== b.centerDistance) {
      return a.centerDistance - b.centerDistance;
    }

    if (a.viewingZoneDistance !== b.viewingZoneDistance) {
      return a.viewingZoneDistance - b.viewingZoneDistance;
    }

    if (a.score !== b.score) {
      return a.score - b.score;
    }

    return compareSeatSets(a.seats, b.seats);
  }

  calculateCenterDistance(candidate: readonly Seat[], screen: Screen) {
    const rowCenter = getRowCenter(screen);
    const midpoint =
      candidate.reduce((total, seat) => total + seat.seatNumber, 0) /
      candidate.length;

    return Math.abs(midpoint - rowCenter);
  }

  calculateViewingZoneDistance(candidate: readonly Seat[], screen: Screen) {
    const { rowStart, rowEnd, centerBias } = screen.preferredViewingZone;

    return candidate.reduce((total, seat) => {
      if (seat.positionY >= rowStart && seat.positionY <= rowEnd) {
        return total;
      }

      const distance =
        seat.positionY < rowStart
          ? rowStart - seat.positionY
          : seat.positionY - rowEnd;

      return total + distance * Math.max(centerBias, 1);
    }, 0);
  }

  calculateSplitDistance(candidate: readonly Seat[]) {
    const clusters = splitIntoClusters(candidate);

    if (clusters.length <= 1) {
      return 0;
    }

    const clusterCenters = clusters.map((cluster) => {
      const x =
        cluster.reduce((total, seat) => total + seat.seatNumber, 0) /
        cluster.length;
      const y =
        cluster.reduce((total, seat) => total + seat.positionY, 0) /
        cluster.length;

      return { x, y };
    });

    return clusterCenters.slice(1).reduce((total, center, index) => {
      const previousCenter = clusterCenters[index];
      return (
        total +
        Math.abs(center.x - previousCenter.x) +
        Math.abs(center.y - previousCenter.y)
      );
    }, 0);
  }

  private scoreCandidate(
    candidate: readonly Seat[],
    screen: Screen,
    mode: AllocationMode
  ): AllocationCandidate {
    const breakdown: ScoreBreakdown = {
      fragmentationPenalty:
        this.fragmentationAnalyzer.calculateFragmentationPenalty(
          candidate,
          screen
        ),
      centerDistance: this.calculateCenterDistance(candidate, screen),
      viewingZoneDistance: this.calculateViewingZoneDistance(candidate, screen),
      clusterCount: splitIntoClusters(candidate).length,
      splitDistance:
        mode === "SPLIT" ? this.calculateSplitDistance(candidate) : 0,
    };

    const score =
      this.weights.fragmentation * breakdown.fragmentationPenalty +
      this.weights.center * breakdown.centerDistance +
      this.weights.viewingZone * breakdown.viewingZoneDistance +
      this.weights.cluster * Math.max(0, breakdown.clusterCount - 1) +
      this.weights.splitDistance * breakdown.splitDistance;

    return {
      ...breakdown,
      mode,
      seats: [...candidate],
      score,
    };
  }
}
