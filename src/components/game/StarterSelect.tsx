"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { usePlayers } from "@/db/hooks";
import { getPlayerDisplayName } from "@/utils/helpers";
import type { Position } from "@/types/database";

const POSITION_COLORS: Record<Position, string> = {
  PG: "bg-blue-500",
  SG: "bg-green-500",
  SF: "bg-orange-500",
  PF: "bg-red-500",
  C: "bg-purple-500",
};

interface StarterSelectProps {
  teamId: string;
  selected: string[];
  onToggle: (playerId: string) => void;
  maxSelect?: number;
}

export function StarterSelect({
  teamId,
  selected,
  onToggle,
  maxSelect = 5,
}: StarterSelectProps) {
  const players = usePlayers(teamId);
  const activePlayers = useMemo(
    () =>
      players
        .filter((p) => p.isActive)
        .sort((a, b) => a.number - b.number),
    [players]
  );

  const selectedPlayers = useMemo(
    () => activePlayers.filter((p) => selected.includes(p.id)),
    [activePlayers, selected]
  );

  const unselectedPlayers = useMemo(
    () => activePlayers.filter((p) => !selected.includes(p.id)),
    [activePlayers, selected]
  );

  return (
    <div className="space-y-4">
      {/* 選択状況 */}
      <div className="flex items-center gap-2">
        <span
          className={`text-2xl font-bold ${
            selected.length === maxSelect
              ? "text-basketball-success"
              : "text-basketball-text"
          }`}
        >
          {selected.length}
        </span>
        <span className="text-basketball-muted">/ {maxSelect} 人選択</span>
      </div>

      {/* 選択済み */}
      {selectedPlayers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPlayers.map((p) => (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-basketball-home/20 border border-basketball-home text-basketball-text font-semibold text-sm transition-colors min-h-0 min-w-0"
            >
              <Check className="h-4 w-4 text-basketball-home" />
              #{p.number}
              {p.name && ` ${p.name}`}
            </button>
          ))}
        </div>
      )}

      {/* 選手一覧 */}
      <div className="space-y-1.5">
        {unselectedPlayers.map((p) => {
          const isFull = selected.length >= maxSelect;
          return (
            <button
              key={p.id}
              onClick={() => !isFull && onToggle(p.id)}
              disabled={isFull}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors min-h-0 ${
                isFull
                  ? "border-basketball-border bg-basketball-surface opacity-40 cursor-not-allowed"
                  : "border-basketball-border bg-basketball-surface hover:border-basketball-home/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-basketball-home flex items-center justify-center text-white font-bold text-xl shrink-0">
                {p.number}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">
                  {getPlayerDisplayName(p)}
                </p>
              </div>
              {p.position && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold text-white ${POSITION_COLORS[p.position]}`}
                >
                  {p.position}
                </span>
              )}
            </button>
          );
        })}

        {activePlayers.length === 0 && (
          <div className="py-8 text-center text-basketball-muted">
            <p>アクティブな選手がいません</p>
            <p className="text-sm mt-1">
              チーム管理画面から選手を登録してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
