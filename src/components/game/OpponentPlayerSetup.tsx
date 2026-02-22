"use client";

import { useState, useMemo } from "react";
import { Users, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePlayers, useTeam } from "@/db/hooks";
import { createPlayersQuick } from "@/db/queries/players";

interface OpponentPlayerSetupProps {
  teamId: string;
  onNext: () => void;
  onSkip: () => void;
}

export function OpponentPlayerSetup({
  teamId,
  onNext,
  onSkip,
}: OpponentPlayerSetupProps) {
  const team = useTeam(teamId);
  const players = usePlayers(teamId);
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.number - b.number),
    [players]
  );
  const existingNumbers = useMemo(
    () => players.map((p) => p.number),
    [players]
  );

  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    added: number[];
    skipped: number[];
  } | null>(null);

  const handleAdd = async () => {
    setResult(null);
    const rawNumbers = input
      .replace(/、/g, ",")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 99);

    const unique = [...new Set(rawNumbers)];
    const added: number[] = [];
    const skipped: number[] = [];

    for (const num of unique) {
      if (existingNumbers.includes(num)) {
        skipped.push(num);
      } else {
        added.push(num);
      }
    }

    if (added.length > 0) {
      await createPlayersQuick(teamId, added);
    }
    setResult({ added, skipped });
    setInput("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-basketball-muted">
        相手選手を登録すると、試合中に個別スタッツを記録できます
      </p>

      {/* 登録済み選手 */}
      {sortedPlayers.length > 0 && (
        <div>
          <p className="text-sm font-medium text-basketball-muted mb-2">
            登録済み選手（{sortedPlayers.length}人）
          </p>
          <div className="flex flex-wrap gap-2">
            {sortedPlayers.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1.5 rounded-lg bg-basketball-border text-basketball-text font-bold text-sm min-h-0 min-w-0"
              >
                #{p.number}
                {p.name && ` ${p.name}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 一括追加 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-basketball-muted">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">背番号を追加</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setResult(null);
              }}
              placeholder="4, 7, 11, 15, 23"
              className="flex-1 h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
            />
            <Button onClick={handleAdd} disabled={!input.trim()}>
              追加
            </Button>
          </div>
          {result && (
            <div className="text-sm space-y-1">
              {result.added.length > 0 && (
                <p className="text-basketball-success">
                  #{result.added.join(", #")} を追加しました
                </p>
              )}
              {result.skipped.length > 0 && (
                <p className="text-basketball-muted">
                  #{result.skipped.join(", #")} は登録済みのためスキップ
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* スキップ */}
      <button
        onClick={onSkip}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-basketball-border text-basketball-muted hover:text-basketball-text hover:border-basketball-home/50 transition-colors min-h-0"
      >
        <SkipForward className="h-4 w-4" />
        <span className="text-sm">
          スキップ（スコア記録のみ）
        </span>
      </button>
      <p className="text-xs text-basketball-muted text-center">
        相手チームの個別スタッツは記録しません
      </p>
    </div>
  );
}
