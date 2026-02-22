"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { POSITIONS } from "@/constants/actions";
import type { Player, Position } from "@/types/database";

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOpponent: boolean;
  existingNumbers: number[];
  initialData?: Player;
  onSubmit: (data: {
    number: number;
    name: string;
    position: Position | null;
  }) => void;
}

export function PlayerForm({
  open,
  onOpenChange,
  isOpponent,
  existingNumbers,
  initialData,
  onSubmit,
}: PlayerFormProps) {
  const [number, setNumber] = useState(
    initialData ? String(initialData.number) : ""
  );
  const [name, setName] = useState(initialData?.name ?? "");
  const [position, setPosition] = useState<Position | null>(
    initialData?.position ?? null
  );
  const [error, setError] = useState("");

  const isEditing = !!initialData;

  const handleSubmit = () => {
    setError("");

    const num = parseInt(number, 10);
    if (isNaN(num) || num < 0 || num > 99) {
      setError("背番号は0〜99の数字で入力してください");
      return;
    }

    // 背番号重複チェック（編集時は自分自身を除外）
    const isDuplicate = existingNumbers.some(
      (n) => n === num && (!isEditing || initialData.number !== num)
    );
    if (isDuplicate) {
      setError(`背番号 #${num} は既に登録されています`);
      return;
    }

    if (!isOpponent && !name.trim()) {
      setError("名前を入力してください");
      return;
    }

    onSubmit({ number: num, name: name.trim(), position });
    // リセット
    setNumber("");
    setName("");
    setPosition(null);
    setError("");
    onOpenChange(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setNumber(initialData ? String(initialData.number) : "");
      setName(initialData?.name ?? "");
      setPosition(initialData?.position ?? null);
      setError("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClose={() => handleOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "選手を編集" : "選手を追加"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* 背番号 */}
          <div>
            <label className="block text-sm font-medium text-basketball-muted mb-1">
              背番号 *
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="0"
              className="w-full h-16 rounded-xl border border-basketball-border bg-basketball-bg text-center text-4xl font-bold text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
            />
          </div>

          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-basketball-muted mb-1">
              名前{!isOpponent && " *"}
              {isOpponent && (
                <span className="text-basketball-muted ml-1">（任意）</span>
              )}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isOpponent ? "入力しなくてもOK" : "名前を入力"}
              className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
            />
          </div>

          {/* ポジション */}
          <div>
            <label className="block text-sm font-medium text-basketball-muted mb-2">
              ポジション（任意）
            </label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() =>
                    setPosition(
                      position === pos.value ? null : (pos.value as Position)
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors min-h-0 min-w-0 ${
                    position === pos.value
                      ? "bg-basketball-home text-white"
                      : "bg-basketball-border text-basketball-muted hover:text-basketball-text"
                  }`}
                >
                  {pos.value}
                </button>
              ))}
            </div>
          </div>

          {/* エラー */}
          {error && (
            <p className="text-basketball-miss text-sm">{error}</p>
          )}

          {/* 送信 */}
          <Button onClick={handleSubmit} className="w-full">
            {isEditing ? "更新する" : "追加する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
