import type { Metadata } from "next";
import { SeatingDemoClient } from "@/components/seating-demo/seating-demo-client";

export const metadata: Metadata = {
  title: "Seating Allocation Demo",
  description:
    "Focused ATSE Assessment 3 demo for constraint-aware cinema seat allocation.",
};

export default function SeatingDemoPage() {
  return <SeatingDemoClient />;
}
