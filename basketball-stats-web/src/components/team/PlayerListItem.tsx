"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Player, Position } from "@/types/database";
import { getPlayerDisplayName } from "@/utils/helpers";

const POSITION_COLORS: Record<Position, string> = {
  PG: "bg-blue-500",
  SG: "bg-green-500",
  SF: "bg-orange-500",
  PF: "bg-red-500",
  C: "bg-purple-500",
};

const POSITION_SHORT: Record<Position, string> = {
  PG: "PG",
  SG: "SG",
  SF: "SF",
  PF: "PF",
  C: "C",
};

interface PlayerListItemProps {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
  showActiveToggle?: boolean;
  onToggleActive?: () => void;
}

export function PlayerListItem({
  player,
  onEdit,
  onDelete,
  showActiveToggle,
  onToggleActive,
}: PlayerListItemProps) {
  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-xl border border-basketball-border bg-basketball-surface transition-colors ${
        !player.isActive ? "opacity-50" : ""
      }`}
    >
      {/* 背番号 */}
      <div className="w-14 h-14 rounded-full bg-basketball-home flex items-center justify-center text-white font-bold text-2xl shrink-0">
        {player.number}
      </div>

      {/* 名前 + ポジション */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-lg truncate">
          {player.name || `#${player.number}`}
        </p>
        <div className="flex items-center gap-2">
          {player.position && (
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold text-white ${POSITION_COLORS[player.position]}`}
            >
              {POSITION_SHORT[player.position]}
            </span>
          )}
          {!player.isActive && (
            <span className="text-xs text-basketball-muted">非アクティブ</span>
          )}
        </div>
      </div>

      {/* アクティブ切替トグル */}
      {showActiveToggle && onToggleActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive();
          }}
          className={`relative w-12 h-7 rounded-full transition-colors min-h-0 min-w-0 ${
            player.isActive ? "bg-basketball-success" : "bg-basketball-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
              player.isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      )}

      {/* 編集 / 削除ボタン */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-lg text-basketball-muted hover:text-basketball-home hover:bg-basketball-home/10 transition-colors min-h-0 min-w-0"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-lg text-basketball-muted hover:text-basketball-miss hover:bg-basketball-miss/10 transition-colors min-h-0 min-w-0"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
