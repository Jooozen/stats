"use client";

import { useParams } from "next/navigation";
import { Users, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeam, usePlayersByTeam } from "@/db/hooks";
import { POSITIONS } from "@/constants/actions";

export default function PlayersPage() {
  const params = useParams();
  const teamId = params.id as string;
  const team = useTeam(teamId);
  const players = usePlayersByTeam(teamId);

  const positionLabel = (pos: string) =>
    POSITIONS.find((p) => p.value === pos)?.label ?? pos;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/team">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {team?.name ?? "読み込み中..."}
          </h1>
          <p className="text-sm text-basketball-muted">選手管理</p>
        </div>
        <Button size="default">
          <Plus className="h-5 w-5 mr-1" />
          選手追加
        </Button>
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-basketball-muted opacity-50 mb-4" />
            <p className="text-lg text-basketball-muted">
              選手がまだ登録されていません
            </p>
            <p className="text-sm text-basketball-muted mt-1">
              「選手追加」ボタンから選手を追加しましょう
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {players
            .sort((a, b) => a.number - b.number)
            .map((player) => (
              <Card key={player.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-basketball-home flex items-center justify-center text-white text-xl font-bold">
                    {player.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{player.name}</p>
                    <p className="text-sm text-basketball-muted">
                      {player.position
                        ? positionLabel(player.position)
                        : "ポジション未設定"}
                    </p>
                  </div>
                  {!player.isActive && (
                    <span className="text-sm text-basketball-muted bg-basketball-border px-2 py-1 rounded">
                      非アクティブ
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
