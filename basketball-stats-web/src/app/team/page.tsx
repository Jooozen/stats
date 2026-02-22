"use client";

import Link from "next/link";
import { Users, Plus, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeams } from "@/db/hooks";

export default function TeamListPage() {
  const teams = useTeams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">チーム管理</h1>
        <Button size="default">
          <Plus className="h-5 w-5 mr-1" />
          チーム追加
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-basketball-muted opacity-50 mb-4" />
            <p className="text-lg text-basketball-muted">
              チームがまだ登録されていません
            </p>
            <p className="text-sm text-basketball-muted mt-1">
              「チーム追加」ボタンからチームを追加しましょう
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/team/${team.id}/players`}>
              <Card className="hover:border-basketball-home transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
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
                        {team.isOwnTeam ? "自チーム" : "対戦相手"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-basketball-muted" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
