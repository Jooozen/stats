import { db } from "../database";
import type { Team } from "@/types/database";
import { generateId, nowISO } from "@/utils/helpers";

/** チームを作成 */
export async function createTeam(
  name: string,
  isOwnTeam: boolean
): Promise<Team> {
  const now = nowISO();
  const team: Team = {
    id: generateId(),
    name,
    isOwnTeam,
    createdAt: now,
    updatedAt: now,
  };
  await db.teams.add(team);
  return team;
}

/** 自チームを取得 */
export async function getOwnTeam(): Promise<Team | undefined> {
  return db.teams.where("isOwnTeam").equals(1).first();
}

/** 対戦相手チーム一覧を取得 */
export async function getOpponentTeams(): Promise<Team[]> {
  return db.teams.where("isOwnTeam").equals(0).toArray();
}

/** 全チーム一覧を取得 */
export async function getAllTeams(): Promise<Team[]> {
  return db.teams.orderBy("createdAt").toArray();
}

/** チームを更新 */
export async function updateTeam(
  id: string,
  data: Partial<Omit<Team, "id" | "createdAt">>
): Promise<void> {
  await db.teams.update(id, { ...data, updatedAt: nowISO() });
}

/** チームを削除（所属選手も一緒に削除） */
export async function deleteTeam(id: string): Promise<void> {
  await db.transaction("rw", [db.teams, db.players], async () => {
    await db.players.where("teamId").equals(id).delete();
    await db.teams.delete(id);
  });
}
