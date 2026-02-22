"use client";

import { Trophy, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGames } from "@/db/hooks";
import { formatDate, formatScore } from "@/utils/helpers";
import { GAME_TYPES } from "@/constants/actions";

export default function GameCreatePage() {
  const games = useGames();

  const gameTypeLabel = (type: string) =>
    GAME_TYPES.find((t) => t.value === type)?.label ?? type;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">試合</h1>
        <Button size="default">
          <Plus className="h-5 w-5 mr-1" />
          新しい試合
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>試合一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-basketball-muted opacity-50 mb-4" />
              <p className="text-lg text-basketball-muted">
                まだ試合がありません
              </p>
              <p className="text-sm text-basketball-muted mt-1">
                「新しい試合」ボタンから試合を作成しましょう
              </p>
              <p className="text-sm text-basketball-muted mt-1">
                まずチームと選手を登録してください
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <Link
                  key={game.id}
                  href={
                    game.status === "live"
                      ? `/game/${game.id}/live`
                      : `/game/${game.id}/summary`
                  }
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-basketball-bg hover:bg-basketball-border transition-colors">
                    <div>
                      <p className="text-sm text-basketball-muted">
                        {formatDate(game.gameDate)}
                        {" / "}
                        {gameTypeLabel(game.gameType)}
                      </p>
                      {game.tournamentName && (
                        <p className="text-sm text-basketball-muted">
                          {game.tournamentName}
                        </p>
                      )}
                      <p className="text-xl font-bold mt-1">
                        {formatScore(game.homeScore, game.awayScore)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.status === "upcoming" && (
                        <span className="px-2 py-1 rounded bg-basketball-border text-basketball-muted text-sm font-medium">
                          予定
                        </span>
                      )}
                      {game.status === "live" && (
                        <span className="px-2 py-1 rounded bg-basketball-miss/20 text-basketball-miss text-sm font-medium animate-pulse">
                          LIVE
                        </span>
                      )}
                      {game.status === "finished" && (
                        <span className="px-2 py-1 rounded bg-basketball-success/20 text-basketball-success text-sm font-medium">
                          終了
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
