"use client";

import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Team } from "@/types/database";

interface TeamCardProps {
  team: Team;
  playerCount: number;
  onDelete?: () => void;
}

export function TeamCard({ team, playerCount, onDelete }: TeamCardProps) {
  return (
    <div className="group relative">
      <Link href={`/team/${team.id}/players`}>
        <Card className="hover:border-basketball-home transition-colors cursor-pointer">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  team.isOwnTeam
                    ? "bg-basketball-home"
                    : "bg-basketball-away"
                }`}
              >
                {team.name.slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-lg">{team.name}</p>
                <p className="text-sm text-basketball-muted">
                  選手: {playerCount}人
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 rounded-lg text-basketball-muted hover:text-basketball-miss hover:bg-basketball-miss/10 transition-colors opacity-0 group-hover:opacity-100 min-h-0 min-w-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <ChevronRight className="h-5 w-5 text-basketball-muted" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
