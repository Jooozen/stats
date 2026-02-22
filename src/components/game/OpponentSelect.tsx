"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpponentTeams } from "@/db/hooks";
import { createTeam } from "@/db/queries/teams";

interface OpponentSelectProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OpponentSelect({
  selectedId,
  onSelect,
}: OpponentSelectProps) {
  const opponents = useOpponentTeams();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    if (!newName.trim()) {
      setError("チーム名を入力してください");
      return;
    }
    const team = await createTeam(newName.trim(), false);
    onSelect(team.id);
    setNewName("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-3">
      {opponents.length > 0 && (
        <div className="space-y-2">
          {opponents.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelect(team.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors min-h-0 ${
                selectedId === team.id
                  ? "border-basketball-home bg-basketball-home/10"
                  : "border-basketball-border bg-basketball-surface hover:border-basketball-home/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-basketball-away flex items-center justify-center text-white font-bold text-sm">
                  {team.name.slice(0, 2)}
                </div>
                <span className="font-semibold text-lg">{team.name}</span>
              </div>
              {selectedId === team.id && (
                <Check className="h-6 w-6 text-basketball-home" />
              )}
            </button>
          ))}
        </div>
      )}

      {opponents.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center text-basketball-muted">
            <p>登録済みの対戦相手がありません</p>
            <p className="text-sm mt-1">下のボタンから追加してください</p>
          </CardContent>
        </Card>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowAdd(true)}
      >
        <Plus className="h-5 w-5 mr-1" />
        新しいチームを追加
      </Button>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent onClose={() => setShowAdd(false)}>
          <DialogHeader>
            <DialogTitle>対戦相手チームを追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例: △△高校"
              className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            {error && (
              <p className="text-basketball-miss text-sm">{error}</p>
            )}
            <Button onClick={handleAdd} className="w-full">
              追加する
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
