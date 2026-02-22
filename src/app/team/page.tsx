"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Users, Plus, ChevronRight, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamCard } from "@/components/team/TeamCard";
import { useOwnTeam, useOpponentTeams, usePlayerCounts } from "@/db/hooks";
import { createTeam, updateTeam, deleteTeam } from "@/db/queries/teams";

export default function TeamListPage() {
  const ownTeam = useOwnTeam();
  const opponentTeams = useOpponentTeams();

  // 全チームIDの選手数を一括取得
  const allTeamIds = useMemo(() => {
    const ids: string[] = [];
    if (ownTeam) ids.push(ownTeam.id);
    for (const t of opponentTeams) ids.push(t.id);
    return ids;
  }, [ownTeam, opponentTeams]);
  const playerCounts = usePlayerCounts(allTeamIds);

  // 自チーム登録モーダル
  const [showOwnTeamDialog, setShowOwnTeamDialog] = useState(false);
  const [ownTeamName, setOwnTeamName] = useState("");
  const [ownTeamError, setOwnTeamError] = useState("");

  // 自チーム編集モーダル
  const [showEditOwnTeamDialog, setShowEditOwnTeamDialog] = useState(false);
  const [editOwnTeamName, setEditOwnTeamName] = useState("");

  // 対戦相手追加モーダル
  const [showOpponentDialog, setShowOpponentDialog] = useState(false);
  const [opponentName, setOpponentName] = useState("");
  const [opponentError, setOpponentError] = useState("");

  // 削除確認モーダル
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 自チーム登録
  const handleCreateOwnTeam = async () => {
    setOwnTeamError("");
    if (!ownTeamName.trim()) {
      setOwnTeamError("チーム名を入力してください");
      return;
    }
    await createTeam(ownTeamName.trim(), true);
    setOwnTeamName("");
    setShowOwnTeamDialog(false);
  };

  // 自チーム名編集
  const handleEditOwnTeam = async () => {
    if (!ownTeam || !editOwnTeamName.trim()) return;
    await updateTeam(ownTeam.id, { name: editOwnTeamName.trim() });
    setShowEditOwnTeamDialog(false);
  };

  // 対戦相手追加
  const handleCreateOpponent = async () => {
    setOpponentError("");
    if (!opponentName.trim()) {
      setOpponentError("チーム名を入力してください");
      return;
    }
    await createTeam(opponentName.trim(), false);
    setOpponentName("");
    setShowOpponentDialog(false);
  };

  // チーム削除
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteTeam(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">チーム管理</h1>

      {/* ===== 自チーム セクション ===== */}
      <section>
        <h2 className="text-lg font-semibold text-basketball-muted mb-3">
          自チーム
        </h2>

        {ownTeam ? (
          <Card className="border-basketball-home/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-basketball-home flex items-center justify-center text-white font-bold">
                  {ownTeam.name.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold">{ownTeam.name}</p>
                  <p className="text-sm text-basketball-muted">
                    選手: {playerCounts[ownTeam.id] ?? 0}人
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditOwnTeamName(ownTeam.name);
                    setShowEditOwnTeamDialog(true);
                  }}
                  className="text-sm text-basketball-muted hover:text-basketball-text px-3 py-1.5 rounded-lg hover:bg-basketball-border transition-colors min-h-0 min-w-0"
                >
                  編集
                </button>
              </div>
              <Link href={`/team/${ownTeam.id}/players`}>
                <Button variant="outline" className="w-full mt-3">
                  選手管理
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Shield className="h-12 w-12 text-basketball-muted opacity-50 mb-3" />
              <p className="text-basketball-muted mb-4">
                自チームが登録されていません
              </p>
              <Button onClick={() => setShowOwnTeamDialog(true)}>
                <Plus className="h-5 w-5 mr-1" />
                自チームを登録
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ===== 対戦相手 セクション ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-basketball-muted">
            対戦相手チーム
          </h2>
        </div>

        {opponentTeams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-10 w-10 text-basketball-muted opacity-50 mb-2" />
              <p className="text-sm text-basketball-muted">
                まだ対戦相手チームがありません
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {opponentTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                playerCount={playerCounts[team.id] ?? 0}
                onDelete={() =>
                  setDeleteTarget({ id: team.id, name: team.name })
                }
              />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={() => setShowOpponentDialog(true)}
        >
          <Plus className="h-5 w-5 mr-1" />
          対戦相手チームを追加
        </Button>
      </section>

      {/* ===== 自チーム登録モーダル ===== */}
      <Dialog open={showOwnTeamDialog} onOpenChange={setShowOwnTeamDialog}>
        <DialogContent onClose={() => setShowOwnTeamDialog(false)}>
          <DialogHeader>
            <DialogTitle>自チームを登録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-basketball-muted mb-1">
                チーム名
              </label>
              <input
                type="text"
                value={ownTeamName}
                onChange={(e) => setOwnTeamName(e.target.value)}
                placeholder="例: ○○高校バスケ部"
                className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleCreateOwnTeam()}
              />
            </div>
            {ownTeamError && (
              <p className="text-basketball-miss text-sm">{ownTeamError}</p>
            )}
            <Button onClick={handleCreateOwnTeam} className="w-full">
              登録する
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== 自チーム名編集モーダル ===== */}
      <Dialog
        open={showEditOwnTeamDialog}
        onOpenChange={setShowEditOwnTeamDialog}
      >
        <DialogContent onClose={() => setShowEditOwnTeamDialog(false)}>
          <DialogHeader>
            <DialogTitle>チーム名を編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={editOwnTeamName}
              onChange={(e) => setEditOwnTeamName(e.target.value)}
              className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleEditOwnTeam()}
            />
            <Button onClick={handleEditOwnTeam} className="w-full">
              更新する
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== 対戦相手追加モーダル ===== */}
      <Dialog open={showOpponentDialog} onOpenChange={setShowOpponentDialog}>
        <DialogContent onClose={() => setShowOpponentDialog(false)}>
          <DialogHeader>
            <DialogTitle>対戦相手チームを追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-basketball-muted mb-1">
                チーム名
              </label>
              <input
                type="text"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                placeholder="例: △△高校"
                className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleCreateOpponent()
                }
              />
            </div>
            {opponentError && (
              <p className="text-basketball-miss text-sm">{opponentError}</p>
            )}
            <Button onClick={handleCreateOpponent} className="w-full">
              追加する
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== 削除確認モーダル ===== */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent onClose={() => setDeleteTarget(null)}>
          <DialogHeader>
            <DialogTitle>チームを削除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-basketball-text">
              <span className="font-bold">{deleteTarget?.name}</span>{" "}
              を削除しますか？
            </p>
            <p className="text-sm text-basketball-muted">
              所属する選手データも全て削除されます。この操作は取り消せません。
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
                onClick={handleDelete}
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
