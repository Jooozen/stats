"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAddPlayersProps {
  existingNumbers: number[];
  onAdd: (numbers: number[]) => void;
}

export function QuickAddPlayers({
  existingNumbers,
  onAdd,
}: QuickAddPlayersProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    added: number[];
    skipped: number[];
  } | null>(null);

  const handleAdd = () => {
    setResult(null);

    // カンマ・スペース・全角カンマで分割
    const rawNumbers = input
      .replace(/、/g, ",")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 99);

    // 重複除去
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
      onAdd(added);
    }

    setResult({ added, skipped });
    setInput("");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-basketball-muted">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">背番号で一括追加</span>
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
            placeholder="4, 7, 11, 15, 23, 30"
            className="flex-1 h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
          />
          <Button
            onClick={handleAdd}
            disabled={!input.trim()}
            size="default"
          >
            一括追加
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
            {result.added.length === 0 && result.skipped.length === 0 && (
              <p className="text-basketball-muted">
                有効な背番号が入力されていません
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
