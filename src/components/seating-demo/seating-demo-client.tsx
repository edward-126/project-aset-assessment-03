"use client";

import { useMemo, useState } from "react";
import { RotateCcw, TicketCheck } from "lucide-react";
import {
  allocateSeats,
  createScenario,
  SCENARIO_IDS,
  type AllocationResult,
  type RequestType,
  type ScenarioId,
  type Seat,
  type SeatMap,
} from "@/domain/seating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const GROUP_SIZES = [1, 2, 3, 4, 5, 6, 7] as const;
const REQUEST_TYPES: RequestType[] = [
  "standard",
  "vip",
  "accessible",
  "adminOverride",
];

const requestTypeLabels = {
  standard: "Standard",
  vip: "VIP",
  accessible: "Accessibility",
  adminOverride: "Admin override",
} satisfies Record<RequestType, string>;

const seatStateLabels = {
  available: "Available",
  selected: "Selected",
  held: "Held",
  booked: "Booked",
  broken: "Broken",
  unavailable: "Unavailable",
} as const;

const seatStateClasses = {
  available: "bg-background text-foreground hover:bg-muted",
  selected: "bg-primary text-primary-foreground border-primary",
  held: "bg-secondary text-muted-foreground",
  booked:
    "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30",
  broken: "bg-red-600 hover:bg-red-500 text-white border-red-700 opacity-95",
  unavailable:
    "bg-accent/40 text-muted-foreground border-foreground/20 border-dashed opacity-60",
} as const;

const zoneClasses = {
  standard: "",
  vip: "bg-primary/10 text-primary border-primary ring-2 ring-primary/35 ring-offset-1 hover:bg-primary/25",
  accessible:
    "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-500 ring-2 ring-amber-500/45 ring-offset-1",
} as const;

export function SeatingDemoClient() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("halfFull");
  const [groupSize, setGroupSize] = useState(4);
  const [requestType, setRequestType] = useState<RequestType>("standard");
  const [allocationResult, setAllocationResult] =
    useState<AllocationResult | null>(null);

  const scenario = useMemo(() => createScenario(scenarioId), [scenarioId]);
  const selectedSeatIds = useMemo(
    () => new Set(allocationResult?.selectedSeats ?? []),
    [allocationResult]
  );
  const displaySeatMap = useMemo(
    () => applySelectedSeats(scenario.seatMap, selectedSeatIds),
    [scenario.seatMap, selectedSeatIds]
  );

  function runAllocation() {
    setAllocationResult(
      allocateSeats(scenario.seatMap, {
        groupSize,
        requestType,
        allowSplit: true,
      })
    );
  }

  function resetScenario() {
    setAllocationResult(null);
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-20 md:px-6">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* <Badge variant="secondary">
              Constraint-Aware Orphan-Minimising Seat Allocation Algorithm
            </Badge> */}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
              Cinema Seating Allocation Demo
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm leading-6">
              Fixed assessment seating plan, deterministic pressure scenarios,
              restricted-seat rules, split fallback, and score breakdown in one
              focused prototype.
            </p>
          </div>
        </header>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Scenario Controls</CardTitle>
            <CardDescription>
              Choose the pressure case and booking request, then run the
              allocator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <div className="grid gap-4 md:grid-cols-[minmax(16rem,1fr)_9rem_minmax(12rem,14rem)_auto] md:items-end">
                <Field>
                  <FieldLabel htmlFor="scenario">Scenario</FieldLabel>
                  <Select
                    value={scenarioId}
                    onValueChange={(value) => {
                      setScenarioId(value as ScenarioId);
                      setAllocationResult(null);
                    }}
                  >
                    <SelectTrigger id="scenario" className="w-full">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SCENARIO_IDS.map((id) => (
                          <SelectItem key={id} value={id}>
                            {createScenario(id).name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="group-size">Group size</FieldLabel>
                  <Select
                    value={String(groupSize)}
                    onValueChange={(value) => {
                      setGroupSize(Number(value));
                      setAllocationResult(null);
                    }}
                  >
                    <SelectTrigger id="group-size" className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {GROUP_SIZES.map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="request-type">Request type</FieldLabel>
                  <Select
                    value={requestType}
                    onValueChange={(value) => {
                      setRequestType(value as RequestType);
                      setAllocationResult(null);
                    }}
                  >
                    <SelectTrigger id="request-type" className="w-full">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {REQUEST_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {requestTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button type="button" onClick={runAllocation}>
                    <TicketCheck data-icon="inline-start" />
                    Allocate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetScenario}
                  >
                    <RotateCcw data-icon="inline-start" />
                    Reset
                  </Button>
                </div>
              </div>
              <FieldDescription>{scenario.purpose}</FieldDescription>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-lg gap-6">
          <CardHeader>
            <CardTitle>Cinema Layout</CardTitle>
            <CardDescription>
              {scenario.name}: {scenario.purpose}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatGrid seatMap={displaySeatMap} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <AllocationPanel result={allocationResult} />
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Demo Coverage</CardTitle>
              <CardDescription>
                The controls intentionally target assessment evidence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex flex-col gap-2 text-sm leading-6">
                <p>
                  Stress scenarios cover half-full, nearly-full, orphan-risk,
                  solo-risk, restricted seats, and admin override.
                </p>
                <p>
                  The grid renders the same physical blocks used by candidate
                  generation, so aisle gaps match allocation boundaries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SeatGrid({ seatMap }: { seatMap: SeatMap }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max flex-col items-center gap-2">
          {seatMap.rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[2rem_auto_2rem] items-center gap-2"
            >
              <RowLabel>{row.id}</RowLabel>
              <div className="flex gap-5 md:gap-7 xl:gap-8">
                {groupSeatsByBlock(row.seats).map((block) => (
                  <div key={block.id} className="flex gap-1">
                    {block.seats.map((seat) => (
                      <SeatCell key={seat.id} seat={seat} />
                    ))}
                  </div>
                ))}
              </div>
              <RowLabel>{row.id}</RowLabel>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted text-muted-foreground border-border rounded-md border px-4 py-2 text-center text-xs font-medium uppercase tracking-normal">
        Screen
      </div>

      <SeatLegend />
    </div>
  );
}

function RowLabel({ children }: { children: string }) {
  return (
    <div className="text-muted-foreground flex size-8 shrink-0 items-center justify-center font-mono text-xs">
      {children}
    </div>
  );
}

function SeatCell({ seat }: { seat: Seat }) {
  return (
    <div
      title={`${seat.id} ${seatStateLabels[seat.state]} ${seat.zone}`}
      aria-label={`${seat.id} ${seatStateLabels[seat.state]} ${seat.zone}`}
      className={cn(
        "flex size-6 select-none items-center justify-center rounded-md border font-mono text-[0.65rem] font-medium transition-colors md:size-7 md:text-[0.7rem] xl:size-8 xl:text-xs",
        seatStateClasses[seat.state],
        seat.state === "available" && zoneClasses[seat.zone]
      )}
    >
      {seat.column}
    </div>
  );
}

function SeatLegend() {
  const legendItems = [
    ...Object.entries(seatStateLabels)
      .filter(([state]) => !["held", "unavailable"].includes(state))
      .map(([state, label]) => ({
        id: state,
        label,
        className: seatStateClasses[state as keyof typeof seatStateClasses],
      })),
    {
      id: "vip",
      label: "VIP",
      className: zoneClasses.vip,
    },
    {
      id: "accessible",
      label: "Accessible",
      className: zoneClasses.accessible,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {legendItems.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-5 shrink-0 rounded-sm border",
              item.className
            )}
          />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function AllocationPanel({ result }: { result: AllocationResult | null }) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No allocation yet</CardTitle>
          <CardDescription>
            Select a scenario and request, then run the allocator.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isRejected = result.status === "REJECTED";

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Allocation Result</CardTitle>
        <CardDescription>
          <Badge variant={isRejected ? "destructive" : "default"}>
            {result.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6">{result.reason}</p>

          <FieldSet>
            <FieldLabel>Selected seats</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {result.selectedSeats.length > 0 ? (
                result.selectedSeats.map((seatId) => (
                  <Badge key={seatId} variant="outline">
                    {seatId}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">None</span>
              )}
            </div>
          </FieldSet>

          {result.scoreBreakdown && (
            <>
              <Separator />
              <ScoreBreakdownPanel result={result} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBreakdownPanel({ result }: { result: AllocationResult }) {
  const breakdown = result.scoreBreakdown;

  if (!breakdown) {
    return null;
  }

  const rows = [
    ["Orphan penalty", breakdown.orphanSeatPenalty],
    ["Centre distance", breakdown.centreDistancePenalty],
    ["Row preference", breakdown.rowPreferencePenalty],
    ["Restricted-seat penalty", breakdown.restrictedSeatPenalty],
    ["Split penalty", breakdown.splitPenalty],
    ["Tie breaker", breakdown.tieBreaker],
    ["Total", breakdown.total],
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Score breakdown</h2>
        <span className="text-muted-foreground text-xs">
          Considered {result.consideredCandidateCount ?? 0}, rejected{" "}
          {result.rejectedCandidateCount ?? 0}
        </span>
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-mono">{formatScore(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function groupSeatsByBlock(seats: Seat[]) {
  return seats.reduce<{ id: string; seats: Seat[] }[]>((blocks, seat) => {
    const currentBlock = blocks.at(-1);

    if (currentBlock?.id === seat.blockId) {
      currentBlock.seats.push(seat);
      return blocks;
    }

    blocks.push({ id: seat.blockId, seats: [seat] });
    return blocks;
  }, []);
}

function applySelectedSeats(
  seatMap: SeatMap,
  selectedSeatIds: ReadonlySet<string>
) {
  return {
    ...seatMap,
    rows: seatMap.rows.map((row) => ({
      ...row,
      seats: row.seats.map((seat) => ({
        ...seat,
        state: selectedSeatIds.has(seat.id) ? "selected" : seat.state,
      })),
    })),
  };
}

function formatScore(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(3);
}
