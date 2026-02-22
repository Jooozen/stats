"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTeam, usePlayers } from "@/db/hooks";
import { getPlayerDisplayName, formatDate } from "@/utils/helpers";
import { GAME_TYPES } from "@/constants/actions";
import type { GameType, OpponentTrackingLevel } from "@/types/database";

interface GameConfirmationProps {
  ownTeamId: string;
  opponentTeamId: string;
  gameType: GameType;
  tournamentName: string;
  gameDate: string;
  gameTime: string;
  quarterMinutes: number;
  totalQuarters: number;
  isHome: boolean;
  opponentTrackingLevel: OpponentTrackingLevel;
  homeStarters: string[];
  awayStarters: string[];
}

export function GameConfirmation({
  ownTeamId,
  opponentTeamId,
  gameType,
  tournamentName,
  gameDate,
  gameTime,
  quarterMinutes,
  totalQuarters,
  isHome,
  opponentTrackingLevel,
  homeStarters,
  awayStarters,
}: GameConfirmationProps) {
  const ownTeam = useTeam(ownTeamId);
  const opponentTeam = useTeam(opponentTeamId);
  const ownPlayers = usePlayers(ownTeamId);
  const opponentPlayers = usePlayers(opponentTeamId);

  const gameTypeLabel =
    GAME_TYPES.find((t) => t.value === gameType)?.label ?? gameType;

  const dateDisplay = formatDate(gameDate);
  const timeDisplay = gameTime || "";

  const ownStarterPlayers = useMemo(
    () =>
      homeStarters
        .map((id) => ownPlayers.find((p) => p.id === id))
        .filter(Boolean),
    [homeStarters, ownPlayers]
  );

  const opponentStarterPlayers = useMemo(
    () =>
      awayStarters
        .map((id) => opponentPlayers.find((p) => p.id === id))
        .filter(Boolean),
    [awayStarters, opponentPlayers]
  );

  return (
    <div className="space-y-4">
      {/* 試合情報 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-basketball-muted text-sm">試合情報</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-basketball-muted">対戦</span>
              <span className="font-semibold">
                {isHome
                  ? `${ownTeam?.name ?? "?"} vs ${opponentTeam?.name ?? "?"}`
                  : `${opponentTeam?.name ?? "?"} vs ${ownTeam?.name ?? "?"}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basketball-muted">種別</span>
              <span className="font-semibold">{gameTypeLabel}</span>
            </div>
            {tournamentName && (
              <div className="flex justify-between">
                <span className="text-basketball-muted">大会</span>
                <span className="font-semibold">{tournamentName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-basketball-muted">日時</span>
              <span className="font-semibold">
                {dateDisplay}
                {timeDisplay && ` ${timeDisplay}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basketball-muted">設定</span>
              <span className="font-semibold">
                {quarterMinutes}分 x {totalQuarters}Q
                （{isHome ? "ホーム" : "アウェイ"}）
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basketball-muted">相手記録</span>
              <span className="font-semibold">
                {opponentTrackingLevel === "full"
                  ? "詳細スタッツ"
                  : "スコアのみ"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自チーム スターター */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-basketball-muted text-sm">
            {ownTeam?.name} スターター
          </h3>
          {ownStarterPlayers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ownStarterPlayers.map(
                (p) =>
                  p && (
                    <span
                      key={p.id}
                      className="px-3 py-1.5 rounded-lg bg-basketball-home/20 border border-basketball-home/30 text-basketball-text font-semibold text-sm"
                    >
                      {getPlayerDisplayName(p)}
                    </span>
                  )
              )}
            </div>
          ) : (
            <p className="text-sm text-basketball-muted">未選択</p>
          )}
        </CardContent>
      </Card>

      {/* 相手チーム スターター */}
      {opponentTrackingLevel === "full" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold text-basketball-muted text-sm">
              {opponentTeam?.name} スターター
            </h3>
            {opponentStarterPlayers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {opponentStarterPlayers.map(
                  (p) =>
                    p && (
                      <span
                        key={p.id}
                        className="px-3 py-1.5 rounded-lg bg-basketball-away/20 border border-basketball-away/30 text-basketball-text font-semibold text-sm"
                      >
                        {getPlayerDisplayName(p)}
                      </span>
                    )
                )}
              </div>
            ) : (
              <p className="text-sm text-basketball-muted">未選択</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
