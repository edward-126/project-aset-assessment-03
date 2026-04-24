import type { Screen, Seat } from "@/types/domain";

export const ALLOCATION_ERROR_CODES = [
  "MISSING_SCREEN",
  "INVALID_GROUP_SIZE",
  "GROUP_TOO_LARGE",
  "INSUFFICIENT_AVAILABLE_SEATS",
] as const;

export type AllocationErrorCode = (typeof ALLOCATION_ERROR_CODES)[number];

export class AllocationError extends Error {
  constructor(
    public readonly code: AllocationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "AllocationError";
  }
}

export type AllocationMode = "CONTIGUOUS" | "SPLIT";

export interface AllocationRequest {
  screen: Screen | null | undefined;
  groupSize: number;
}

export interface ScoreBreakdown {
  fragmentationPenalty: number;
  centerDistance: number;
  viewingZoneDistance: number;
  clusterCount: number;
  splitDistance: number;
}

export interface AllocationCandidate extends ScoreBreakdown {
  mode: AllocationMode;
  seats: Seat[];
  score: number;
}

export interface AllocationResult {
  screenId: string;
  groupSize: number;
  mode: AllocationMode;
  seats: Seat[];
  score: number;
  candidate: AllocationCandidate;
}

export interface AllocationWeights {
  fragmentation: number;
  center: number;
  viewingZone: number;
  cluster: number;
  splitDistance: number;
}

export type ValidAllocationRequest = {
  screen: Screen;
  groupSize: number;
};
