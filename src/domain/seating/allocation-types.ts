import type { RequestType, Seat } from "./types";

export interface AllocationRequest {
  groupSize: number;
  requestType: RequestType;
  allowSplit?: boolean;
}

export type AllocationStatus =
  | "ALLOCATED"
  | "REJECTED"
  | "OVERRIDE_ALLOCATED"
  | "SPLIT_ALLOCATED";

export interface ScoreBreakdown {
  orphanSeatPenalty: number;
  centreDistancePenalty: number;
  rowPreferencePenalty: number;
  restrictedSeatPenalty: number;
  splitPenalty: number;
  tieBreaker: number;
  total: number;
}

export interface AllocationResult {
  status: AllocationStatus;
  selectedSeats: string[];
  reason: string;
  scoreBreakdown?: ScoreBreakdown;
  rejectedCandidateCount?: number;
  consideredCandidateCount?: number;
}

export interface ValidationResult {
  valid: boolean;
  reasons: string[];
}

export interface ScoredCandidate {
  seats: Seat[];
  scoreBreakdown: ScoreBreakdown;
}
