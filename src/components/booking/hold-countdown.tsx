"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

function getRemainingMs(expiresAt: string | null | undefined) {
  if (!expiresAt) {
    return 0;
  }

  return Math.max(0, new Date(expiresAt).getTime() - Date.now());
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HoldCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string | null | undefined;
  onExpire?: () => void;
}) {
  const [remainingMs, setRemainingMs] = useState(() =>
    getRemainingMs(expiresAt)
  );
  const isExpired = remainingMs <= 0;
  const label = useMemo(() => formatRemaining(remainingMs), [remainingMs]);

  useEffect(() => {
    if (!expiresAt) {
      const timeout = window.setTimeout(() => setRemainingMs(0), 0);

      return () => window.clearTimeout(timeout);
    }

    const initialTimeout = window.setTimeout(() => {
      setRemainingMs(getRemainingMs(expiresAt));
    }, 0);
    const interval = window.setInterval(() => {
      const nextRemaining = getRemainingMs(expiresAt);
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0) {
        window.clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
    };
  }, [expiresAt, onExpire]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
      <span className="text-muted-foreground">Hold countdown</span>
      <Badge variant={isExpired ? "destructive" : "secondary"}>
        {isExpired ? "Expired" : label}
      </Badge>
    </div>
  );
}
