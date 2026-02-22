"use client";

import Link from "next/link";
import { Trophy, Users, BarChart3, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGames } from "@/db/hooks";
import { formatDate, formatScore } from "@/utils/helpers";

export default function HomePage() {
  const games = useGames();
  const recentGames = games.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Basketball Stats</h1>
        <p className="text-basketball-muted mt-1">
          バスケットボール スタッツ記録
        </p>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/game/create">
          <Card className="hover:border-basketball-home transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <Plus className="h-8 w-8 text-basketball-home" />
              <span className="text-base font-medium">新しい試合</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/team">
          <Card className="hover:border-basketball-home transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <Users className="h-8 w-8 text-basketball-home" />
              <span className="text-base font-medium">チーム管理</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/stats">
          <Card className="hover:border-basketball-home transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <BarChart3 className="h-8 w-8 text-basketball-home" />
              <span className="text-base font-medium">スタッツ</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/game/create">
          <Card className="hover:border-basketball-home transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <Trophy className="h-8 w-8 text-basketball-home" />
              <span className="text-base font-medium">試合一覧</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 最近の試合 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の試合</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length === 0 ? (
            <div className="text-center py-8 text-basketball-muted">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg">まだ試合がありません</p>
              <p className="text-sm mt-1">
                「新しい試合」から試合を作成しましょう
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <Link
                  key={game.id}
                  href={
                    game.status === "live"
                      ? `/game/${game.id}/live`
                      : `/game/${game.id}/summary`
                  }
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-basketball-bg hover:bg-basketball-border transition-colors">
                    <div>
                      <p className="text-sm text-basketball-muted">
                        {formatDate(game.date)}
                      </p>
                      <p className="text-lg font-bold">
                        {formatScore(game.homeScore, game.awayScore)}
                      </p>
                    </div>
                    {game.status === "live" && (
                      <span className="px-2 py-1 rounded bg-basketball-miss/20 text-basketball-miss text-sm font-medium">
                        LIVE
                      </span>
                    )}
                    {game.status === "finished" && (
                      <span className="px-2 py-1 rounded bg-basketball-success/20 text-basketball-success text-sm font-medium">
                        終了
                      </span>
                    )}
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
