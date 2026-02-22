"use client";

import { useMemo } from "react";
import { useGames } from "@/db/hooks";
import type { GameType } from "@/types/database";

interface TournamentNameInputProps {
  value: string;
  onChange: (value: string) => void;
  gameType: GameType;
}

export function TournamentNameInput({
  value,
  onChange,
  gameType,
}: TournamentNameInputProps) {
  const games = useGames();

  // 過去の大会名からサジェスト（重複除去）
  const suggestions = useMemo(() => {
    const names = games
      .map((g) => g.tournamentName)
      .filter((n) => n.length > 0);
    return [...new Set(names)];
  }, [games]);

  return (
    <div className="space-y-3">
      {gameType === "official" && (
        <p className="text-sm text-basketball-home">
          公式戦の場合は入力推奨
        </p>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: インターハイ予選"
        className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
      />

      {suggestions.length > 0 && (
        <div>
          <p className="text-sm text-basketball-muted mb-2">
            過去の大会名
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => onChange(name)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors min-h-0 min-w-0 ${
                  value === name
                    ? "bg-basketball-home text-white"
                    : "bg-basketball-border text-basketball-muted hover:text-basketball-text"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
