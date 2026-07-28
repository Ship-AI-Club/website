"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LiveRefreshForm() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, [router]);

  function refresh() {
    setRefreshing(true);
    router.refresh();
    window.setTimeout(() => setRefreshing(false), 700);
  }

  return (
    <div className="ac-actions">
      <button type="button" className="ac-btn-link ac-btn-sm" onClick={refresh} disabled={refreshing}>
        <RefreshCw size={18} strokeWidth={1.75} aria-hidden="true" />
        {refreshing ? "Refreshing…" : "Refresh now"}
      </button>
      <span className="ac-fine">Counters refresh every 30 seconds.</span>
    </div>
  );
}
