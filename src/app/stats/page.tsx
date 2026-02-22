"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">スタッツ分析</h1>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-basketball-muted opacity-50 mb-4" />
          <p className="text-xl font-bold text-basketball-muted">
            スタッツ分析
          </p>
          <p className="text-sm text-basketball-muted mt-2">
            準備中 — 今後のアップデートで実装予定です
          </p>
          <p className="text-sm text-basketball-muted mt-1">
            チーム・選手のスタッツを分析できるようになります
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
