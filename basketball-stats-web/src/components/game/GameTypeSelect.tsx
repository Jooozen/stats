"use client";

import { Trophy, Swords, Users } from "lucide-react";
import type { GameType } from "@/types/database";

const GAME_TYPE_OPTIONS: {
  value: GameType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "official",
    label: "公式戦",
    description: "大会・リーグ戦など公式な試合",
    icon: <Trophy className="h-6 w-6" />,
  },
  {
    value: "practice",
    label: "練習試合",
    description: "他チームとの練習試合",
    icon: <Swords className="h-6 w-6" />,
  },
  {
    value: "scrimmage",
    label: "紅白戦",
    description: "チーム内の紅白戦（準備中）",
    icon: <Users className="h-6 w-6" />,
  },
];

interface GameTypeSelectProps {
  selected: GameType;
  onSelect: (type: GameType) => void;
}

export function GameTypeSelect({
  selected,
  onSelect,
}: GameTypeSelectProps) {
  return (
    <div className="space-y-3">
      {GAME_TYPE_OPTIONS.map((opt) => {
        const isScrimmage = opt.value === "scrimmage";
        return (
          <button
            key={opt.value}
            onClick={() => !isScrimmage && onSelect(opt.value)}
            disabled={isScrimmage}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors min-h-0 ${
              isScrimmage
                ? "border-basketball-border bg-basketball-surface opacity-40 cursor-not-allowed"
                : selected === opt.value
                  ? "border-basketball-home bg-basketball-home/10"
                  : "border-basketball-border bg-basketball-surface hover:border-basketball-home/50"
            }`}
          >
            <div
              className={`${
                selected === opt.value
                  ? "text-basketball-home"
                  : "text-basketball-muted"
              }`}
            >
              {opt.icon}
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg">{opt.label}</p>
              <p className="text-sm text-basketball-muted">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
