"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Table } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/db/hooks";

export default function GameSummaryPage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = useGame(gameId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/game/create">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">試合結果</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Table className="h-16 w-16 text-basketball-muted opacity-50 mb-4" />
          <p className="text-xl font-bold text-basketball-muted">
            ボックススコア
          </p>
          <p className="text-sm text-basketball-muted mt-2">
            準備中 — 今後のアップデートで実装予定です
          </p>
          <p className="text-sm text-basketball-muted mt-1">
            試合のスタッツを詳細に確認できるようになります
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
