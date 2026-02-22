"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Users, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlayerListItem } from "@/components/team/PlayerListItem";
import { PlayerForm } from "@/components/team/PlayerForm";
import { QuickAddPlayers } from "@/components/team/QuickAddPlayers";
import { useTeam, usePlayers } from "@/db/hooks";
import {
  createPlayer,
  createPlayersQuick,
  updatePlayer,
  deletePlayer,
} from "@/db/queries/players";
import type { Player, Position } from "@/types/database";

export default function PlayersPage() {
  const params = useParams();
  const teamId = params.id as string;
  const team = useTeam(teamId);
  const players = usePlayers(teamId);

  const isOpponent = team ? !team.isOwnTeam : false;

  // 既存背番号リスト
  const existingNumbers = useMemo(
    () => players.map((p) => p.number),
    [players]
  );

  // アクティブ / 非アクティブ分離（背番号順）
  const activePlayers = useMemo(
    () =>
      players
        .filter((p) => p.isActive)
        .sort((a, b) => a.number - b.number),
    [players]
  );

  const inactivePlayers = useMemo(
    () =>
      players
        .filter((p) => !p.isActive)
        .sort((a, b) => a.number - b.number),
    [players]
  );

  // 選手追加モーダル
  const [showAddForm, setShowAddForm] = useState(false);

  // 選手編集モーダル
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // 削除確認モーダル
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);

  // 選手追加
  const handleAddPlayer = async (data: {
    number: number;
    name: string;
    position: Position | null;
  }) => {
    await createPlayer(teamId, data.number, data.name, data.position);
  };

  // 選手編集
  const handleEditPlayer = async (data: {
    number: number;
    name: string;
    position: Position | null;
  }) => {
    if (!editingPlayer) return;
    await updatePlayer(editingPlayer.id, {
      number: data.number,
      name: data.name,
      position: data.position,
    });
    setEditingPlayer(null);
  };

  // 選手削除
  const handleDeletePlayer = async () => {
    if (!deleteTarget) return;
    await deletePlayer(deleteTarget.id);
    setDeleteTarget(null);
  };

  // アクティブ切替
  const handleToggleActive = async (player: Player) => {
    await updatePlayer(player.id, { isActive: !player.isActive });
  };

  // 一括追加
  const handleQuickAdd = async (numbers: number[]) => {
    await createPlayersQuick(teamId, numbers);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <Link href="/team">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {team?.name ?? "読み込み中..."}
          </h1>
          <p className="text-sm text-basketball-muted">
            選手管理
            {players.length > 0 && ` (${players.length}人)`}
          </p>
        </div>
        <Button size="default" onClick={() => setShowAddForm(true)}>
          <Plus className="h-5 w-5 mr-1" />
          選手追加
        </Button>
      </div>

      {/* 選手リスト */}
      {players.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-basketball-muted opacity-50 mb-4" />
            <p className="text-lg text-basketball-muted">
              選手がまだ登録されていません
            </p>
            <p className="text-sm text-basketball-muted mt-1">
              「選手追加」ボタンから選手を追加しましょう
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {activePlayers.map((player) => (
            <PlayerListItem
              key={player.id}
              player={player}
              onEdit={() => setEditingPlayer(player)}
              onDelete={() => setDeleteTarget(player)}
              showActiveToggle={!isOpponent}
              onToggleActive={() => handleToggleActive(player)}
            />
          ))}

          {/* 非アクティブ選手 */}
          {inactivePlayers.length > 0 && (
            <>
              <p className="text-sm text-basketball-muted pt-4">
                非アクティブ ({inactivePlayers.length}人)
              </p>
              {inactivePlayers.map((player) => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  onEdit={() => setEditingPlayer(player)}
                  onDelete={() => setDeleteTarget(player)}
                  showActiveToggle={!isOpponent}
                  onToggleActive={() => handleToggleActive(player)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* 背番号一括追加（相手チーム専用） */}
      {isOpponent && (
        <QuickAddPlayers
          existingNumbers={existingNumbers}
          onAdd={handleQuickAdd}
        />
      )}

      {/* 選手追加モーダル */}
      <PlayerForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        isOpponent={isOpponent}
        existingNumbers={existingNumbers}
        onSubmit={handleAddPlayer}
      />

      {/* 選手編集モーダル */}
      {editingPlayer && (
        <PlayerForm
          open={!!editingPlayer}
          onOpenChange={(open) => !open && setEditingPlayer(null)}
          isOpponent={isOpponent}
          existingNumbers={existingNumbers}
          initialData={editingPlayer}
          onSubmit={handleEditPlayer}
        />
      )}

      {/* 削除確認モーダル */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent onClose={() => setDeleteTarget(null)}>
          <DialogHeader>
            <DialogTitle>選手を削除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-basketball-text">
              <span className="font-bold">
                #{deleteTarget?.number}{" "}
                {deleteTarget?.name || ""}
              </span>{" "}
              を削除しますか？
            </p>
            <p className="text-sm text-basketball-muted">
              この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteTarget(null)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeletePlayer}
              >
                削除する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
